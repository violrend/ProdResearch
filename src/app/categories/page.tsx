"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Bell, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { 
    name: "Laptops", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: "Powerful computing on the go", 
    badge: "Popular" 
  },
  { 
    name: "Smartphones", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    description: "Stay connected anywhere", 
    badge: "New" 
  },
  { 
    name: "Headphones", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    description: "Immersive audio experience", 
    badge: "" 
  },
  { 
    name: "Cameras", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: "Capture life's moments", 
    badge: "" 
  },
  { 
    name: "Smartwatches", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "Tech on your wrist", 
    badge: "Trending" 
  },
  { 
    name: "TVs", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: "Cinematic entertainment at home", 
    badge: "" 
  },
  { 
    name: "Home Appliances", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    description: "Simplify your daily life", 
    badge: "" 
  },
  { 
    name: "Fashion", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    description: "Express your style", 
    badge: "Sale" 
  },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
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
                <Link href="/" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:border-blue-500 transition-all duration-300">
                  Home
                </Link>
                <Link href="/categories" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl"
        >
          <h1 className="text-5xl font-bold text-white mb-4 text-center">Explore Categories</h1>
          <p className="text-xl text-center text-white/80 mb-12">Discover our top products in each category</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="block h-full">
                  <Card
                    className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-300 h-full"
                    onMouseEnter={() => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      {category.icon}
                      <h2 className="text-2xl font-bold mb-2 text-center">{category.name}</h2>
                      <p className="text-sm text-center text-white/80 mb-4">{category.description}</p>
                      {category.badge && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          {category.badge}
                        </span>
                      )}
                      {hoveredCategory === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 text-sm font-semibold"
                        >
                          Explore {category.name}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <footer className="mt-16 text-center text-white/80 pb-8">
        <p>&copy; 2024 ProdAI. All rights reserved.</p>
      </footer>
    </div>
  );
}