// eslint-disable-next-line react/no-unescaped-entities

"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, BarChart3, Zap, Filter, BookmarkPlus, Sparkles, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";


export default function LandingPage() {
  const fadeInUp: Variants= {

    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 text-white font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}>
      <header className="bg-blue-700 shadow-md py-4 px-6">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="h-8 w-8 mr-2" />
            ProdAI
          </Link>
          <div>
            <Link href="/signup">
              <Button 
                variant="outline" 
                className="bg-white text-blue-700 border-white hover:bg-blue-100 hover:text-blue-800 transition-colors"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-32 px-6 overflow-hidden">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="container mx-auto text-center relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">Your AI Product Research Assistant</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-blue-100 font-medium">
              Join 10,000+ smart shoppers in finding your perfect product, effortlessly.
            </p>
            <Link href="/input-form">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-8 px-12 rounded-full text-2xl transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Start Your Smart Search Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container mx-auto"
          >
            <h2 className="text-5xl font-bold text-center mb-16 text-white">How ProdAI Transforms Your Shopping</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Search, title: "Effortless Input", description: "Simply tell us what you're looking for, and let our AI do the heavy lifting." },
                { icon: BarChart3, title: "Personalized Scores", description: "Get tailored 'Fit Scores' that match products to your unique needs." },
                { icon: Zap, title: "Informed Decisions", description: "Make confident choices with our detailed pros and cons summaries." }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="text-center h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-700 border-none">
                    <CardContent className="pt-6">
                      <div className="bg-blue-600 rounded-full p-6 inline-block mb-6">
                        <step.icon className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                      <p className="text-blue-100">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container mx-auto"
          >
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Discover the ProdAI Advantage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { icon: BarChart3, title: "Smart Fit Score", description: "Our AI analyzes thousands of data points to find your perfect match." },
                { icon: Zap, title: "Pros & Cons at a Glance", description: "Save time with instant insights into each product's strengths and weaknesses." },
                { icon: Search, title: "Effortless Comparisons", description: "Compare multiple products side-by-side with ease." },
                { icon: Zap, title: "Real-time Market Insights", description: "Stay ahead with up-to-the-minute product information and user feedback." },
                { icon: Filter, title: "Precision Filtering", description: "Narrow down options quickly with our advanced, intuitive filters." },
                { icon: BookmarkPlus, title: "Smart Lists", description: "Save and share your top picks with friends and family." }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start hover:bg-blue-600 p-4 rounded-lg transition-colors duration-300"
                >
                  <div className="bg-blue-700 rounded-full p-4 mr-5">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-blue-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>


        {/* About Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container mx-auto"
          >
            <h2 className="text-5xl font-bold text-center mb-16 text-white">About ProdAI</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl mb-8 text-blue-100">
                ProdAI was born from a simple idea: make online shopping smarter and more personalized. Our founder, a tech enthusiast and avid online shopper, was frustrated with the overwhelming number of options and lack of personalized recommendations in e-commerce.
              </p>
              <p className="text-xl mb-8 text-blue-100">
                Leveraging the power of artificial intelligence and machine learning, we developed Prodigi to revolutionize the way people shop online. Our AI-driven platform analyzes vast amounts of product data, user preferences, and market trends to provide tailored product recommendations.
              </p>
              <p className="text-xl text-blue-100">
                Today, ProdAI is helping thousands of shoppers find their perfect products with ease, saving time and reducing the stress of online shopping. We're constantly innovating and improving our AI to bring you the most accurate and helpful product recommendations possible.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="bg-blue-700 text-white py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-3xl font-bold flex items-center mb-4">
              <Sparkles className="h-10 w-10 mr-2" />
              ProdAI
            </Link>
            <p className="text-lg text-blue-200 max-w-xs">Your AI-powered shopping companion, revolutionizing the way you discover perfect products.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div>
              <h3 className="text-xl font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-blue-600 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">&copy; {new Date().getFullYear()} ProdAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-blue-200 hover:text-white transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-blue-200 hover:text-white transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-blue-200 hover:text-white transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}