// src/components/Blog/BlogCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTags, FaClock } from 'react-icons/fa';
import { formatDate, calculateReadTime } from './utils';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/config';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const BlogCard = ({ blog, layout, selectedTags, onTagSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = blog.coverImage 
    ? getImageUrl(blog.coverImage) 
    : IMAGE_PLACEHOLDER;

  return (
    <motion.div 
      variants={itemVariants}
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 h-full flex ${layout === 'list' ? 'flex-row max-h-48' : 'flex-col max-h-96'}`}
    >
      <div className={`${layout === 'list' ? 'w-1/4 h-auto' : 'h-40'} bg-gray-100 dark:bg-gray-700 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
        <img 
          src={imageSrc}
          alt={blog.title} 
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error('Image failed to load:', blog.coverImage);
            setImageError(true);
          }}
        />
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className={`p-4 flex-1 flex flex-col ${layout === 'list' ? 'w-3/4 overflow-hidden' : ''}`}>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
          <FaCalendarAlt className="mr-1 text-blue-500 dark:text-blue-400" />
          <span>{formatDate(blog.createdAt)}</span>
          <span className="mx-2">•</span>
          <FaClock className="mr-1 text-blue-500 dark:text-blue-400" />
          <span>{calculateReadTime(blog.content)} min read</span>
        </div>
        
        <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          <Link to={`/blog/${blog.slug}`} state={{ blogData: blog }}>{blog.title}</Link>
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-grow line-clamp-2">{blog.excerpt}</p>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center flex-wrap mb-2 gap-1">
            <FaTags className="text-blue-500 dark:text-blue-400 mr-1 text-xs" />
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 cursor-pointer
                  ${selectedTags.includes(tag) 
                    ? 'bg-blue-500 text-white dark:bg-blue-600' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{blog.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <Link 
            to={`/blog/${blog.slug}`} 
            state={{ blogData: blog }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center group"
          >
            Read More
            <svg 
              className="w-3 h-3 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;