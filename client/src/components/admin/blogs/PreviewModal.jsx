// client/src/components/admin/blogs/PreviewModal.jsx
import React from 'react';
import { XMarkIcon, CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../../utils/config'; // Import getImageUrl function

const PreviewModal = ({ blog, onClose }) => {
  if (!blog) return null;
  
  const { 
    title, 
    content, 
    coverImage, 
    coverImageUrl, 
    createdAt, 
    createdBy, 
    tags 
  } = blog;
  
  // Use getImageUrl function to properly format the image URL
  const imageUrl = getImageUrl(coverImageUrl || coverImage) || IMAGE_PLACEHOLDER;
  
  // Format the date
  const formattedDate = createdAt 
    ? format(new Date(createdAt), 'MMMM dd, yyyy') 
    : 'Unknown date';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Preview Blog Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Cover Image */}
          {imageUrl && (
            <div className="w-full h-64 relative overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = IMAGE_PLACEHOLDER;
                }}
              />
            </div>
          )}
          
          <div className="p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            
            {/* Meta Information */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {/* Date */}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              
              {/* Author */}
              {/* {createdBy && (
                <div className="flex items-center">
                  <UserCircleIcon className="h-4 w-4 mr-1" />
                  {createdBy.username || 'Anonymous'}
                </div>
              )} */}
            </div>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Content */}
            <div 
              className="mt-6 prose dark:prose-invert prose-a:text-blue-600 prose-a:dark:text-blue-400 max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;