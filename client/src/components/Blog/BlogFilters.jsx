// src/components/Blog/BlogFilters.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFilter, 
  FaTimes, 
  FaSortAmountDown, 
  FaSortAmountUp 
} from 'react-icons/fa';
import { getSortLabel } from './utils';

export const TrendingTags = ({ trendingTags, selectedTags, onTagSelect }) => {
  return (
    <div className="flex items-center flex-wrap gap-2 mb-2 md:mb-0">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending:</span>
      {trendingTags.map((tag, index) => (
        <button
          key={index}
          onClick={() => onTagSelect(tag)}
          className={`text-xs px-3 py-1 rounded-full transition-colors duration-200
            ${selectedTags.includes(tag) 
              ? 'bg-blue-500 text-white dark:bg-blue-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export const SortDropdown = ({ sortBy, setSortBy, showSortOptions, setShowSortOptions }) => {
  return (
    <div className="relative">
      <button
        onClick={() => setShowSortOptions(!showSortOptions)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
      >
        {sortBy.includes('desc') ? <FaSortAmountDown className="text-blue-500 dark:text-blue-400" /> : <FaSortAmountUp className="text-blue-500 dark:text-blue-400" />}
        {getSortLabel(sortBy)}
      </button>
      
      <AnimatePresence>
        {showSortOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-30"
          >
            <div className="py-1">
              {[
                { id: 'date-desc', label: 'Newest First' },
                { id: 'date-asc', label: 'Oldest First' },
                { id: 'title-asc', label: 'Title A-Z' },
                { id: 'title-desc', label: 'Title Z-A' },
                { id: 'popularity', label: 'Most Popular' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setShowSortOptions(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                    ${sortBy === option.id 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LayoutToggle = ({ layout, setLayout }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-1 flex">
      <button
        onClick={() => setLayout('grid')}
        className={`p-2 rounded ${layout === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        aria-label="Grid layout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setLayout('list')}
        className={`p-2 rounded ${layout === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        aria-label="List layout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export const FilterButton = ({ filterOpen, setFilterOpen, selectedTags }) => {
  return (
    <button 
      onClick={() => setFilterOpen(!filterOpen)}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
    >
      <FaFilter className="text-blue-500 dark:text-blue-400" />
      Filters
      {selectedTags.length > 0 && (
        <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {selectedTags.length}
        </span>
      )}
    </button>
  );
};

export const FilterPanel = ({ 
  filterOpen, 
  setFilterOpen, 
  allTags, 
  selectedTags, 
  handleTagSelect,
  clearFilters
}) => {
  return (
    <AnimatePresence>
      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Filter Articles</h3>
              <button 
                onClick={() => setFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagSelect(tag)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors duration-200
                      ${selectedTags.includes(tag) 
                        ? 'bg-blue-500 text-white dark:bg-blue-600' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ActiveFilters = ({ searchTerm, setSearchTerm, selectedTags, handleTagSelect, clearFilters, sortBy }) => {
  if (!(searchTerm || selectedTags.length > 0 || sortBy !== 'date-desc')) {
    return null;
  }
  
  return (
    <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
        
        {searchTerm && (
          <div className="flex items-center bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 shadow-sm">
            <span className="mr-2">"{searchTerm}"</span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <FaTimes size={10} />
            </button>
          </div>
        )}
        
        {selectedTags.map((tag, index) => (
          <div 
            key={index}
            className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <span className="mr-2">{tag}</span>
            <button
              onClick={() => handleTagSelect(tag)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
        
        <button
          onClick={clearFilters}
          className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};