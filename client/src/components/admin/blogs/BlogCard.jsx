// client/src/components/admin/blogs/BlogCard.jsx
import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../../utils/config'; // Import getImageUrl function

const BlogCard = ({ blog, onEdit, onDelete, onPreview }) => {
  const { title, excerpt, coverImage, coverImageUrl, createdAt, published, tags } = blog;
  
  // Use getImageUrl function to properly format the image URL
  const imageUrl = getImageUrl(coverImageUrl || coverImage) || IMAGE_PLACEHOLDER;
  
  // Format the date (e.g., "2 days ago")
  const formattedDate = createdAt 
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) 
    : 'Unknown date';

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = IMAGE_PLACEHOLDER;
            }}
          />
        )}
        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{title}</h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="mt-2 flex items-start">
            <TagIcon className="flex-shrink-0 mt-0.5 mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {excerpt || 'No excerpt available'}
        </p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onPreview}
            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            title="Preview"
          >
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;