// client/src/components/admin/blogs/Header.jsx
import React from 'react';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Header = ({ onNewPost, onRefresh, isRefreshing }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your blog content in one place
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          onClick={onNewPost}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Post
        </button>
      </div>
    </div>
  );
};

export default Header;