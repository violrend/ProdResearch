import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
from serpapi import GoogleSearch

CORS(app)
app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
logger = app.logger

# Initialize Bedrock client
bedrock = boto3.client('bedrock-runtime')

BEDROCK_MODEL = 'anthropic.claude-3-sonnet-20240229-v1:0'
SERPAPI_KEY = os.environ.get('SERPAPI_KEY')

# Ensure SERPAPI_KEY is set
if not SERPAPI_KEY:
    logger.error("SERPAPI_KEY is not set. Please set the environment variable.")
    raise ValueError("SERPAPI_KEY environment variable is not set")

def search_products(query, num_results=5):
    params = {
        "engine": "google_shopping",
        "q": query,
        "num": num_results,
        "api_key": SERPAPI_KEY
    }
    
    logger.debug(f"Sending request to SerpAPI with params: {params}")
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        
        logger.debug(f"Received response from SerpAPI: {json.dumps(results, indent=2)}")
        
        products = []
        for item in results.get('shopping_results', []):
            product = {
                "name": item.get('title'),
                "price": item.get('price'),
                "extracted_price": item.get('extracted_price'),
                "rating": item.get('rating'),
                "reviews": item.get('reviews'),
                "image": item.get('thumbnail'),
                "link": item.get('link'),
                "description": item.get('snippet'),
                "source": item.get('source'),
                "extensions": item.get('extensions', [])
            }
            products.append(product)
        
        logger.debug(f"Processed {len(products)} products")
        return products
    except Exception as e:
        logger.error(f"Error in search_products: {str(e)}")
        return []

def invoke_bedrock_model(prompt, max_tokens=1000):
    try:
        response = bedrock.invoke_model(
            modelId=BEDROCK_MODEL,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "messages": [
                    {
                        "role": "human",
                        "content": prompt
                    }
                ]
            })
        )
        # Make sure to correctly parse the response
        response_body = json.loads(response['body'].read())
        
        if 'content' in response_body and len(response_body['content']) > 0:
            return response_body['content'][0]['text']
        else:
            logger.error(f"Unexpected response structure: {response_body}")
            return None
    except ClientError as e:
        logger.error(f"Error invoking Bedrock model: {e}")
        return None

def generate_fit_score(product, user_preferences):
    prompt = f"""Given the following product details and user preferences, generate a fit score from 1 to 10 (where 10 is a perfect fit) and provide a brief explanation for the score.

Product: {json.dumps(product)}
User Preferences: {json.dumps(user_preferences)}

Respond with a JSON object containing the score and explanation. For example:
{{
    "score": 8,
    "explanation": "This product matches most of the user's preferences, particularly in terms of features. However, it might not fully meet all requirements, resulting in a score of 8 out of 10."
}}
"""
    response = invoke_bedrock_model(prompt)
    if response:
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            logger.error(f"Error: Unable to parse JSON response: {response}")
            return {"score": 0, "explanation": "Error generating fit score"}
    else:
        return {"score": 0, "explanation": "Error generating fit score"}

def summarize_pros_cons(product):
    prompt = f"""Based on the following product information, summarize the main pros and cons of the product. Provide up to 3 pros and 3 cons.

Product: {json.dumps(product)}

Respond with a JSON object containing arrays of pros and cons. For example:
{{
    "pros": ["Excellent quality", "Good value for money", "Fast delivery"],
    "cons": ["Size runs small", "Limited color options", "Packaging could be improved"]
}}
"""
    response = invoke_bedrock_model(prompt)
    if response:
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            logger.error(f"Error: Unable to parse JSON response: {response}")
            return {"pros": [], "cons": []}
    else:
        return {"pros": [], "cons": []}

@app.route('/api/product-recommendations', methods=['POST'])
def product_recommendations():
    try:
        data = request.json
        logger.debug(f"Received request data: {data}")
        
        search_query = data.get('searchQuery')
        user_preferences = data.get('preferences', [])

        if not search_query:
            logger.error("Missing search query")
            return jsonify({"error": "Missing search query"}), 400

        logger.debug(f"Calling search_products with query: {search_query}")
        products = search_products(search_query)
        logger.debug(f"Received {len(products)} products from search_products")
        
        if not products:
            logger.warning(f"No products found matching: {search_query}")
            return jsonify({"error": f"No products found matching: {search_query}"}), 404
        
        results = []
        for product in products:
            logger.debug(f"Generating fit score for product: {product['name']}")
            score_data = generate_fit_score(product, user_preferences)
            logger.debug(f"Generated score data: {score_data}")
            
            pros_cons = summarize_pros_cons(product)
            logger.debug(f"Generated pros and cons: {pros_cons}")
            
            result = {
                "name": product.get('name', 'N/A'),
                "fitScore": score_data.get('score', 0),
                "scoreExplanation": score_data.get('explanation', 'N/A'),
                "pros": pros_cons.get('pros', []),
                "cons": pros_cons.get('cons', []),
                "price": product.get('price', 'N/A'),
                "extractedPrice": product.get('extracted_price', 'N/A'),
                "rating": product.get('rating', 'N/A'),
                "reviews": product.get('reviews', 'N/A'),
                "image": product.get('image', 'N/A'),
                "link": product.get('link', 'N/A'),
                "description": product.get('description', 'N/A'),
                "source": product.get('source', 'N/A'),
                "extensions": product.get('extensions', [])
            }
            results.append(result)
        
        logger.debug(f"Processed {len(results)} results")
        
        # Sort results by fit score, descending
        results.sort(key=lambda x: x['fitScore'], reverse=True)
        
        logger.info(f"Processed product recommendations for query: {search_query}")
        return jsonify({"products": results})

    except Exception as e:
        logger.error(f"Error processing product recommendations request: {str(e)}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
