"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Clock, Star, ShoppingCart, Sparkles, Bell, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const deals = [
  {
    title: "Premium Noise-Cancelling Headphones",
    discount: "30% OFF",
    originalPrice: "$299.99",
    discountedPrice: "$209.99",
    rating: 4.8,
    reviews: 1250,
    timeLeft: "2 days",
  },
  {
    title: "4K Ultra HD Smart TV - 55\"",
    discount: "25% OFF",
    originalPrice: "$799.99",
    discountedPrice: "$599.99",
    rating: 4.6,
    reviews: 890,
    timeLeft: "3 days",
  },
  {
    title: "Wireless Gaming Mouse",
    discount: "40% OFF",
    originalPrice: "$79.99",
    discountedPrice: "$47.99",
    rating: 4.7,
    reviews: 2100,
    timeLeft: "1 day",
  },
  {
    title: "Smart Home Security Camera",
    discount: "35% OFF",
    originalPrice: "$149.99",
    discountedPrice: "$97.49",
    rating: 4.5,
    reviews: 750,
    timeLeft: "4 days",
  },
];

export default function DealsPage() {

  const router = useRouter();
  
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
                <Link href="/categories" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:border-blue-500 transition-all duration-300">
                  Categories
                </Link>
                <Link href="/deals" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
          <h1 className="text-5xl font-bold text-white mb-4 text-center">Hot Deals</h1>
          <p className="text-xl text-center text-white/80 mb-12">Grab these limited-time offers before they're gone!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-lg font-semibold truncate">{deal.title}</span>
                      <Badge variant="secondary" className="bg-blue-500 text-white">
                        {deal.discount}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-blue-300" />
                        <span className="text-2xl font-bold">{deal.discountedPrice}</span>
                      </div>
                      <span className="text-sm line-through text-gray-400">{deal.originalPrice}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{deal.rating}</span>
                      <span className="text-sm text-gray-300 ml-2">({deal.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-blue-300" />
                      <span>Ends in: {deal.timeLeft}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
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