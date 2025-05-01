// client/src/utils/config.js
// This file contains configuration settings for the application

// API base URL - automatically selects production or development environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, we're serving from the same origin
  : 'http://localhost:5000'; // In development, we're using a separate server

// Function to get the full URL for an image path
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If the image path already includes the base URL or is an absolute URL, return it as is
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${imagePath}`;
};

// Export other configuration settings as needed
export const IMAGE_PLACEHOLDER = '/placeholder-image.jpg';