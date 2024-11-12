// eslint-disable-next-line @typescript-eslint/no-explicit-any

"use client"

import { useState, FormEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, Info, Star, User, Heart, Bell, Sparkles, ExternalLink } from "lucide-react"
import Link from 'next/link'


interface Product {
  name: string;
  price: string;
  fitScore: number;
  pros: string[];
  cons: string[];
  rating: string;
  reviews: string;
  link: string;
  isBestMatch: boolean;
}


export default function ProductInputForm() {

  const [productType, setProductType] = useState('')
  const [budget, setBudget] = useState<[string | number, string | number]>(['', '']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [features, setFeatures] = useState<string>('')

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!productType.trim()) {
      newErrors.productType = 'Please specify a product type'
    }
    if (!features.trim()) {
      newErrors.features = 'Please enter at least one feature'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent, page: number = 1) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
        const response = await fetch('/api/product-recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: productType,
                preferences: {
                    budget: budget,
                    features: features.split(',').map(f => f.trim())
                },
                page: page,
                pageSize: 5
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product recommendations');
        }

        const data = await response.json();
        setResults(data.products);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
    } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'Failed to fetch products. Please try again.' });
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-8">
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/sf-pro-display');

        body {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 700;
        }

        .label {
          font-weight: 500;
        }

        .body-text {
          font-weight: 400;
        }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
                <Link href="/" className="text-2xl font-bold text-blue-600">ProdAI</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/categories" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:border-blue-500 transition-all duration-300">
                  Categories
                </Link>
                <Link href="/deals" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:border-blue-500 transition-all duration-300">
                  Deals
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-blue-100 transition-all duration-300">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-blue-100 transition-all duration-300">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-blue-100 transition-all duration-300">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >

<Card className="backdrop-blur-md bg-white/90 shadow-xl border-0 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
              <CardTitle className="text-4xl font-bold text-center tracking-tight">Find Your Perfect Product</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full bg-blue-100 p-1">
                  <TabsTrigger value="search" className="rounded-full text-sm font-medium transition-all duration-300">Search</TabsTrigger>
                  <TabsTrigger value="results" className="rounded-full text-sm font-medium transition-all duration-300">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="search">
                  <form onSubmit={(e) => handleSubmit(e, 1)} className="space-y-8">
                    {/* Product Type Input */}
                    <div className="space-y-4">
                      <Label htmlFor="productType" className="text-lg font-medium text-gray-700 label">
                        What are you looking for?
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="productType"
                          type="text"
                          placeholder="e.g., laptop, smartphone, headphones"
                          value={productType}
                          onChange={(e) => setProductType(e.target.value)}
                          className={`pl-10 ${errors.productType ? 'border-red-500' : 'border-gray-300'} text-base rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent body-text h-12`}
                          aria-invalid={errors.productType ? 'true' : 'false'}
                          aria-describedby={errors.productType ? 'productType-error' : undefined}
                        />
                      </div>
                      {errors.productType && (
                        <p id="productType-error" className="text-xs text-red-500 mt-1 body-text">{errors.productType}</p>
                      )}
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-4">
                      <Label htmlFor="budget" className="text-lg font-medium text-gray-700 label">
                        Budget Range:
                      </Label>
                      <div className="flex space-x-4">
                        <input
                          type="number"
                          id="budget-min"
                          className="w-full text-base rounded-full border border-gray-300 bg-transparent p-3 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent body-text h-12 placeholder-gray-500 shadow-sm"
                          value={budget[0] !== '' ? String(budget[0]) : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setBudget([value === '' ? '' : Math.max(1, Math.min(Number(value), 999999)), budget[1]]);
                          }}
                          placeholder="Min"
                          min="1"
                          max="999999"
                        />
                        <span className="text-gray-600">-</span>
                        <input
                          type="number"
                          id="budget-max"
                          className="w-full text-base rounded-full border border-gray-300 bg-transparent p-3 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent body-text h-12 placeholder-gray-500 shadow-sm"
                          value={budget[1] !== '' ? String(budget[1]) : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setBudget([budget[0], value === '' ? '' : Math.max(1, Math.min(Number(value), 999999))]);
                          }}
                          placeholder="Max"
                          min="1"
                          max="999999"
                        />
                      </div>
                    </div>


                    {/* Key Features Selection */}
                    <div className="space-y-4">
                      <Label htmlFor="features" className="text-lg font-medium text-gray-700 label">
                        What features are important to you?
                      </Label>
                      <div className="relative">
                        <Input
                          id="features"
                          type="text"
                          placeholder="e.g., long battery life, high performance, large storage"
                          value={features}
                          onChange={(e) => setFeatures(e.target.value)}
                          className="text-base rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent body-text h-12"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Separate features with commas</p>
                      {errors.features && (
                        <p className="text-xs text-red-500 mt-1 body-text">{errors.features}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-6 w-6" />
                          Find My Perfect Product
                        </>
                      )}
                    </Button>

                    {errors.submit && (
                      <p className="text-center text-red-500 mt-4 text-sm body-text">{errors.submit}</p>
                    )}
                  </form>
                </TabsContent>


                {/* Results Section */}
                <TabsContent value="results">
                  <AnimatePresence>
                    {results.length > 0 ? (
                      <>
                        <ul className="space-y-6">
                          {results.map((product, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h4>
                                  <p className="text-gray-600 text-sm mb-2">Price: {product.price}</p>
                                  <div className="flex items-center space-x-2 mb-4">
                                    <Progress value={product.fitScore * 100} className="w-32" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Fit Score: {(product.fitScore * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                                {product.isBestMatch && (
                                  <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                    Best Match
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Pros:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {product.pros.map((pro, i) => (
                                    <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1 rounded-full">
                                      {pro}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Cons:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {product.cons.map((con, i) => (
                                    <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1 rounded-full">
                                      {con}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Star className="text-yellow-400 w-5 h-5 mr-1" />
                                  <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                                </div>
                                <a
                                  href={product.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
                                >
                                  View Product <ExternalLink className="ml-1 w-4 h-4" />
                                </a>
                              </div>
                            </motion.li>
                          ))}
                        </ul>

                        
                        {/* Pagination controls */}
                        <div className="mt-8 flex justify-center items-center space-x-4">
                          <Button
                            onClick={() => {
                              if (currentPage > 1) {
                                handleSubmit(new Event('submit') as any, currentPage - 1);
                              }
                            }}
                            disabled={currentPage === 1 || isLoading}
                            className="px-4 py-2 text-sm"
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            onClick={() => {
                              if (currentPage < totalPages) {
                                handleSubmit(new Event('submit') as any, currentPage + 1);
                              }
                            }}
                            disabled={currentPage === totalPages || isLoading}
                            className="px-4 py-2 text-sm"
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 text-sm body-text">
                        No results yet. Start your search to see products here.
                      </div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center bg-gray-50 p-6">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300">
                    <Info className="w-5 h-5 mr-2" />
                    How it works
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?text=AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold mb-2 text-sm">Product Search Assistant</h3>
                      <p className="text-xs text-gray-500 body-text">
                        Our AI-powered search analyzes your preferences to find the best products that match your needs and budget. We consider factors like product type, key features, and price range to provide personalized recommendations.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}