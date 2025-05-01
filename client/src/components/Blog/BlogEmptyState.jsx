// src/components/blog/BlogEmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegSadTear } from 'react-icons/fa';

const BlogEmptyState = ({ clearFilters, hasFilters }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 flex flex-col items-center"
  >
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
      <FaRegSadTear className="text-6xl text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">No Blog Posts Found</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
      We couldn't find any blog posts matching your current filters. Try adjusting your search criteria or browse all articles.
    </p>
    {hasFilters && (
      <button 
        onClick={clearFilters}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        Clear Filters
      </button>
    )}
  </motion.div>
);

export default BlogEmptyState;