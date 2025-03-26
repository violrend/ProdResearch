import { NextResponse } from 'next/server'

const SERPAPI_KEY = process.env.SERPAPI_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY

async function invokeGroqAI(prompt: string) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            }),
        })

        if (response.ok) {
            return await response.json()
        } else {
            console.error('Groq API returned an error:', response.statusText)
            return null
        }
    } catch (error) {
        console.error('Error invoking Groq AI:', error)
        return null
    }
}

async function generateFitScoreAndProsCons(product: any, userPreferences: any) {
    const prompt = `
        You are an AI product analyst. Given the following product details and user preferences, analyze the product to provide a fit score from 1 to 10 and summarize up to 3 pros and 3 cons.
        Product: ${JSON.stringify(product)}
        User Preferences: - Budget Range: $${userPreferences.budget[0]} - $${userPreferences.budget[1]}
        Desired Features: ${userPreferences.features.join(', ')}

        Consider the following factors when calculating the fit score:
        1. How well the product's price fits within the user's budget range
        2. How many of the user's desired features are present or relevant to the product
        3. The overall quality and ratings of the product
        Respond in a JSON format with the keys "score", "explanation", "pros", and "cons".
    `
    const response = await invokeGroqAI(prompt)

    // Check if response and choices are valid before attempting to parse
    if (response && response.choices && response.choices[0].message.content) {
        try {
            return JSON.parse(response.choices[0].message.content)
        } catch (error) {
            console.error('Error parsing JSON response from Groq AI:', error)
            return { score: 0, explanation: 'Error generating fit score', pros: [], cons: [] }
        }
    } else {
        console.error('Invalid or empty response from Groq AI:', response)
        return { score: 0, explanation: 'No response from Groq AI', pros: [], cons: [] }
    }
}


async function searchProducts(query: string, budget: [number, number], numResults = 5, maxPosition = 10) {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&num=${numResults}&price=${budget[0]}..${budget[1]}&currency=USD&api_key=fa6a4af9abc8a3a5da6cac469894cd004f7de1d814127f5fa34c3ad8b63f46b0`

    try {
        const response = await fetch(url)
        const data = await response.json()

        // Log the entire response for debugging
        console.log('Raw API response:', data)

        if (!data.shopping_results) {
            throw new Error('No shopping results found.')
        }

        return data.shopping_results
            .filter((item: any, index: number) => {
                const price = parseFloat(item.extracted_price)
                return !isNaN(price) && price >= budget[0] && price <= budget[1] && item.position <= maxPosition
            })
            .map((item: any) => ({
                name: item.title || 'N/A',
                price: item.price || 'N/A',
                extractedPrice: parseFloat(item.extracted_price) || 0,
                rating: item.rating || 'N/A',
                reviews: item.reviews || 'N/A',
                image: item.thumbnail || 'N/A',
                link: item.product_link || item.link || 'N/A',
                description: item.snippet || 'N/A',
            }))
    } catch (error) {
        console.error('Error fetching search results:', error)
        return []
    }
}


export async function POST(request: Request) {
    const { searchQuery, preferences, page = 1, pageSize = 5 } = await request.json()

    if (!searchQuery || !preferences || !preferences.budget || preferences.budget.length !== 2) {
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    try {
        const allProducts = await searchProducts(searchQuery, preferences.budget)
        const startIndex = (page - 1) * pageSize
        const productsForCurrentPage = allProducts.slice(startIndex, startIndex + pageSize)

        const processedResults = await Promise.all(
            productsForCurrentPage.map(async (product: any) => {
                const analysis = await generateFitScoreAndProsCons(product, preferences)
                return { ...product, fitScore: analysis.score / 10, ...analysis }
            })
        )

        processedResults.sort((a, b) => b.fitScore - a.fitScore)
        processedResults.slice(0, 3).forEach((product) => (product.isBestMatch = true))

        return NextResponse.json({
            products: processedResults,
            totalProducts: allProducts.length,
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / pageSize),
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Unexpected error', details: (error as Error).toString() }, { status: 500 })
    }
}
