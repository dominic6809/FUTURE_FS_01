// src/components/Blog/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = ({ layout, count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow animate-pulse h-full flex ${layout === 'list' ? 'flex-row max-h-48' : 'flex-col max-h-96'}`}
        >
          <div className={`${layout === 'list' ? 'w-1/4 h-auto' : 'h-40'} bg-gray-200 dark:bg-gray-700`}></div>
          <div className={`p-4 flex-1 ${layout === 'list' ? 'w-3/4' : ''}`}>
            <div className="flex items-center mb-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4 mx-2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="flex gap-1 mb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;