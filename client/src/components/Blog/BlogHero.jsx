// src/components/Blog/BlogHero.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const BlogHero = ({ searchTerm, setSearchTerm, handleSearchSubmit, blogListRef }) => {
  const searchInputRef = useRef(null);

  return (
    <div className="relative mb-16 mx-4 sm:mx-8 lg:mx-16 rounded-2xl overflow-hidden">
      <div className="h-68 sm:h-72 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        ></div>
        
        {/* Content - V Formation */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pb-16 pt-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/15 backdrop-blur-sm px-6 py-2 rounded-xl inline-block mb-4 shadow-lg"
          >
            <h3 className="text-white font-semibold tracking-wider text-sm">Welcome to</h3>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md tracking-tight"
          >
            My BlogSpace
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl px-5 py-2 shadow-lg"
          >
            <h3 className="text-xl md:text-xl font-semibold text-white mb-1">
              <span className="text-indigo-100">Discover</span> • <span className="text-blue-100">Insights</span> • <span className="text-purple-100">Ideas</span>
            </h3>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base text-white mt-4 max-w-lg mx-auto drop-shadow-sm font-medium"
          >
            Exploring tech, development, and creative insights through my journey
          </motion.p>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f9fafb" className="dark:fill-gray-900">
            <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,53.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Search Section - Positioned below the hero */}
      <div className="relative max-w-3xl mx-auto -mt-1 px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onSubmit={handleSearchSubmit}
          className="relative w-full"
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for topics, titles, or content..."
            className="w-full px-6 py-4 rounded-xl border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default BlogHero;