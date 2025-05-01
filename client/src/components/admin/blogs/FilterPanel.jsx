// client/src/components/admin/blogs/FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FilterPanel = ({ filters, onChange, availableTags }) => {
  const [localFilters, setLocalFilters] = useState({...filters});
  
  // Update local state when props change
  useEffect(() => {
    setLocalFilters({...filters});
  }, [filters]);
  
  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };
  
  const handleTagToggle = (tag) => {
    const currentTags = [...localFilters.tags];
    const index = currentTags.indexOf(tag);
    
    if (index === -1) {
      // Add tag
      currentTags.push(tag);
    } else {
      // Remove tag
      currentTags.splice(index, 1);
    }
    
    const updatedFilters = { ...localFilters, tags: currentTags };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };
  
  const clearFilters = () => {
    const resetFilters = {
      published: 'all',
      sortBy: 'newest',
      tags: []
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          Clear all filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Publication Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={localFilters.published}
            onChange={(e) => handleFilterChange('published', e.target.value)}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Posts</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
        
        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a-z">Title (A-Z)</option>
            <option value="z-a">Title (Z-A)</option>
          </select>
        </div>
        
        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          {availableTags && availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagToggle(tag)}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    localFilters.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tag}
                  {localFilters.tags.includes(tag) && (
                    <XMarkIcon className="ml-1 h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No tags available</p>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {(localFilters.published !== 'all' || localFilters.tags.length > 0) && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {localFilters.published !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Status: {localFilters.published === 'published' ? 'Published' : 'Draft'}
                <button 
                  onClick={() => handleFilterChange('published', 'all')}
                  className="ml-1"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {localFilters.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
                <button 
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;