import requests

# Replace this with your actual API key
GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"  

def analyze_product(product_details: str, user_preferences: str):
    """
    Calls the Groq AI API to analyze product details and user preferences.
    
    Args:
    - product_details (str): The product description.
    - user_preferences (str): The user's input preferences.
    
    Returns:
    - dict: The API response containing analysis results.
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Payload for the API
    payload = {
        "product_details": product_details,
        "user_preferences": user_preferences,
        "task": "product_analysis"  # Hypothetical task, use the appropriate task name
    }

    try:
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()  # Raises an error for non-2xx responses
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return {"error": str(http_err)}
    except Exception as err:
        print(f"An error occurred: {err}")
        return {"error": str(err)}
