// client/src/components/shared/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading blog posts...</p>
    </div>
  );
};

export default LoadingState;