// client/src/components/admin/blogs/EmptyState.jsx
import React from 'react';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ onNewPost }) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No blog posts yet</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Create your first blog post to get started.
      </p>
      <div className="mt-6">
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

export default EmptyState;