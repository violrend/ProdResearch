const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleSearch } = require('google-search-results-nodejs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SERPAPI_KEY || !GROQ_API_KEY) {
    console.error('SERPAPI_KEY or GROQ_API_KEY is not set. Please set the environment variables.');
    process.exit(1);
}

async function invokeGroqAI(prompt) {
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'mixtral-8x7b-32768',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Groq API returned an error:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error invoking Groq AI:', error);
        return null;
    }
}

const productFeatures = {
    laptop: [
        { id: 'performance', label: 'High Performance', icon: '⚡', description: 'For demanding tasks like gaming or video editing' },
        { id: 'portability', label: 'Portability', icon: '🏃‍♂️', description: 'Lightweight and easy to carry' },
        { id: 'battery', label: 'Long Battery Life', icon: '🔋', description: 'Extended use without needing to recharge' },
        { id: 'display', label: 'High-Quality Display', icon: '🖥️', description: 'Vibrant colors and high resolution' },
        { id: 'storage', label: 'Large Storage Capacity', icon: '💾', description: 'Ample space for files and applications' },
        { id: 'graphics', label: 'Dedicated Graphics', icon: '🎮', description: 'For gaming and graphic-intensive work' },
        { id: 'brand', label: 'Reputable Brand', icon: '🏆', description: 'Known for quality and reliability' },
        { id: 'price', label: 'Affordable', icon: '💰', description: 'Best value for money' },
    ],
    smartphone: [
        { id: 'camera', label: 'High-Quality Camera', icon: '📷', description: 'For stunning photos and videos' },
        { id: 'battery', label: 'Long Battery Life', icon: '🔋', description: 'All-day usage without recharging' },
        { id: 'display', label: 'Large Display', icon: '📱', description: 'Immersive viewing experience' },
        { id: 'performance', label: 'Fast Performance', icon: '⚡', description: 'Smooth multitasking and app usage' },
        { id: 'storage', label: 'Large Storage', icon: '💾', description: 'Space for apps, photos, and videos' },
        { id: 'design', label: 'Sleek Design', icon: '✨', description: 'Aesthetically pleasing and modern look' },
        { id: 'brand', label: 'Reputable Brand', icon: '🏆', description: 'Known for quality and reliability' },
        { id: 'price', label: 'Affordable', icon: '💰', description: 'Best value for money' },
    ],
    // Add more product types as needed
};


async function generateFitScoreAndProsCons(product, userPreferences) {
    const prompt = `
    You are an AI product analyst. Given the following product details and user preferences, analyze the product to provide a fit score from 1 to 10 and summarize up to 3 pros and 3 cons.

    Product: ${JSON.stringify(product)}
    User Preferences:
    - Budget Range: $${userPreferences.budget[0]} - $${userPreferences.budget[1]}
    - Desired Features: ${userPreferences.features.join(', ')}

    Consider the following factors when calculating the fit score:
    1. How well the product's price fits within the user's budget range
    2. How many of the user's desired features are present or relevant to the product
    3. The overall quality and ratings of the product

    Respond in a JSON format with the keys "score", "explanation", "pros", and "cons". For example:
    {
        "score": 8,
        "explanation": "This product matches most of the user's preferences. It's within the budget and has several desired features, but lacks some specific functionalities.",
        "pros": ["Within budget", "Matches most desired features", "High overall quality"],
        "cons": ["Missing some specific desired features", "At the higher end of the budget range", "May have more features than needed, increasing cost"]
    }
    `;

    const response = await invokeGroqAI(prompt);
    if (response) {
        try {
            const completionContent = response.choices[0].message.content;
            return JSON.parse(completionContent);
        } catch (error) {
            console.error('Error: Unable to parse JSON response:', error);
            return { score: 0, explanation: 'Error generating fit score', pros: [], cons: [] };
        }
    } else {
        return { score: 0, explanation: 'Error generating fit score', pros: [], cons: [] };
    }    
}

function searchProducts(query, budget, numResults = 5, maxPosition = 10) {
    const search = new GoogleSearch(SERPAPI_KEY);

    return new Promise((resolve, reject) => {
        const params = {
            engine: "google_shopping",
            q: query,
            num: numResults,  
            price: `${budget[0]}..${budget[1]}`,
            currency: "USD"
        };

        search.json(params, (data) => {
            if (data.error) {
                reject(data.error);
            } else if (!data.shopping_results) {
                reject('No shopping results found.');
            } else {
                const products = data.shopping_results
                    
                    .filter((item, index) => {
                        const price = parseFloat(item.extracted_price);
                        return (
                            !isNaN(price) && 
                            price >= budget[0] && 
                            price <= budget[1] && 
                            item.position <= maxPosition 
                        );
                    })
                    .slice(0, numResults) 
                    .map((item) => ({
                        name: item.title || 'N/A',
                        price: item.price || 'N/A',
                        extractedPrice: parseFloat(item.extracted_price) || 0,
                        rating: item.rating || 'N/A',
                        reviews: item.reviews || 'N/A',
                        image: item.thumbnail || 'N/A',
                        link: item.product_link || item.link || 'N/A',  
                        description: item.snippet || 'N/A',
                        source: item.source || 'N/A',
                        extensions: item.extensions || [],
                        position: item.position || 'N/A' 
                    }));
                resolve(products);
            }
        });
    });
}

app.post('/api/product-recommendations', async (req, res) => {
    try {
        const { searchQuery, preferences, page = 1, pageSize = 5 } = req.body;
        console.log('Received request data:', { searchQuery, preferences, page, pageSize });

        if (!searchQuery || !preferences || !preferences.budget || preferences.budget.length !== 2) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Get all products within the budget range
        const allProducts = await searchProducts(searchQuery, preferences.budget);
        console.log(`Received ${allProducts.length} products from searchProducts`);

        if (!allProducts.length) {
            return res.status(404).json({ error: `No products found matching: ${searchQuery}` });
        }

        // Calculate pagination indices
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Get products for the current page
        const productsForCurrentPage = allProducts.slice(startIndex, endIndex);

        // Process products for the current page with AI
        const processedResults = await Promise.all(productsForCurrentPage.map(async (product) => {
            const analysisData = await generateFitScoreAndProsCons(product, preferences);
            return {
                ...product,
                fitScore: analysisData.score / 10,
                scoreExplanation: analysisData.explanation || 'N/A',
                pros: analysisData.pros || [],
                cons: analysisData.cons || [],
            };
        }));

        // Sort by fit score for the current page
        processedResults.sort((a, b) => b.fitScore - a.fitScore);

        // Mark top 3 as best match
        processedResults.slice(0, 3).forEach(product => product.isBestMatch = true);

        console.log(`Sending ${processedResults.length} results for page ${page}`);
        return res.json({ 
            products: processedResults,
            totalProducts: allProducts.length,
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / pageSize),
        });
    } catch (error) {
        console.error('Error processing product recommendations request:', error);
        return res.status(500).json({ error: 'An unexpected error occurred', details: error.toString() });
    }
});


app.listen(PORT, () => {
    console.log(`Running the Express server on port ${PORT}...`);
});