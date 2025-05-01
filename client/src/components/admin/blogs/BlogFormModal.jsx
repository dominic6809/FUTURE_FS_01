import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
// Import TinyMCE Editor
import { Editor } from '@tinymce/tinymce-react';
// Import the getImageUrl utility
import { getImageUrl } from '../../../utils/config';

const BlogFormModal = ({ formData, setFormData, editId, onClose, onSuccess, getAuthHeader }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  // Add state for the processed image URL
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  // Access TinyMCE API key from Vite environment variables with fallback
  const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY || '';
  
  // Optional: Show warning if API key is missing
  useEffect(() => {
    if (!TINYMCE_API_KEY) {
      console.warn('TinyMCE API key is missing. Editor functionality may be limited.');
    }
  }, []);

  // Process the image URL when formData changes
  useEffect(() => {
    if (formData.coverImageUrl) {
      setProcessedImageUrl(getImageUrl(formData.coverImageUrl));
    } else {
      setProcessedImageUrl(null);
    }
  }, [formData.coverImageUrl]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke any previous object URL to prevent memory leaks
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
      
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData, 
        coverImage: file,
        previewUrl
      });
    }
  };

  const handleRemoveImage = () => {
    // Revoke object URL to prevent memory leaks
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    
    setFormData({
      ...formData,
      coverImage: null,
      previewUrl: null,
      coverImageUrl: '' // Clear the server path as well
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const blogFormData = new FormData();
      
      // Append all form fields to FormData
      blogFormData.append('title', formData.title);
      blogFormData.append('content', formData.content);
      blogFormData.append('excerpt', formData.excerpt);
      blogFormData.append('published', formData.published);
      
      // If there's a new file selected, append it
      if (formData.coverImage instanceof File) {
        blogFormData.append('coverImage', formData.coverImage);
      }
      
      // Handle tags
      if (formData.tags) {
        blogFormData.append('tags', formData.tags);
      }
      
      let response;
      
      if (editId) {
        // Update existing blog
        response = await axios.put(`/api/blogs/${editId}`, blogFormData, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Blog post updated successfully');
      } else {
        // Create new blog
        response = await axios.post('/api/blogs', blogFormData, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Blog post created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {editId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            {/* Slug (optional display) */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug (auto-generated if left empty)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                URL-friendly version of the title. Will be auto-generated if left empty.
              </p>
            </div>
            
            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows="3"
                value={formData.excerpt}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief summary of the blog post"
              />
            </div>
            
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              
              {/* Show current image preview or upload placeholder */}
              <div className="flex items-center justify-center">
                {(formData.previewUrl || processedImageUrl) ? (
                  <div className="relative">
                    <img 
                      src={formData.previewUrl || processedImageUrl} 
                      alt="Cover preview" 
                      className="h-48 w-auto object-cover rounded-md border border-gray-300 dark:border-gray-600" 
                    />
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md h-48 w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <label htmlFor="coverImage" className="cursor-pointer font-medium text-blue-600 dark:text-blue-300 hover:text-blue-500">
                        Upload a file
                      </label>
                      <input 
                        id="coverImage" 
                        name="coverImage" 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="sr-only" 
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                )}
              </div>
              
              {/* If there's already an image, show the change button */}
              {(formData.previewUrl || processedImageUrl) && (
                <div className="mt-2 flex justify-center">
                  <label 
                    htmlFor="coverImage" 
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Change image
                    <input 
                      id="coverImage" 
                      name="coverImage" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="sr-only" 
                    />
                  </label>
                </div>
              )}
            </div>
            
            {/* Content - TinyMCE Editor with API Key */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <div className={`border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md overflow-hidden`}>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={formData.content}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help | link image media table',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    // Enable automatic uploads of images represented by blob or data URIs
                    automatic_uploads: true,
                    // Add custom file picker callback
                    file_picker_callback: function(callback, value, meta) {
                      // Provide file and text for the link dialog
                      if (meta.filetype === 'file') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.onchange = function() {
                          const file = this.files[0];
                          const reader = new FileReader();
                          reader.onload = function () {
                            const id = 'blobid' + (new Date()).getTime();
                            const blobCache = editorRef.current.editorUpload.blobCache;
                            const base64 = reader.result.split(',')[1];
                            const blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            callback(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }
                      
                      // Provide image and alt text for the image dialog
                      if (meta.filetype === 'image') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = function() {
                          const file = this.files[0];
                          const reader = new FileReader();
                          reader.onload = function () {
                            const id = 'blobid' + (new Date()).getTime();
                            const blobCache = editorRef.current.editorUpload.blobCache;
                            const base64 = reader.result.split(',')[1];
                            const blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            callback(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }
                      
                      // Provide alternative source and posted for the media dialog
                      if (meta.filetype === 'media') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'video/*,audio/*');
                        input.onchange = function() {
                          const file = this.files[0];
                          const reader = new FileReader();
                          reader.onload = function () {
                            callback(reader.result, { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }
                    },
                    // Set up a custom image upload handler
                    images_upload_handler: async (blobInfo, progress) => {
                      try {
                        // Create a FormData instance
                        const formData = new FormData();
                        // Append the file
                        formData.append('file', blobInfo.blob(), blobInfo.filename());
                        
                        // Upload the image to your server
                        // Replace with your actual image upload endpoint
                        const response = await axios.post('/api/upload', formData, {
                          headers: {
                            ...getAuthHeader(),
                            'Content-Type': 'multipart/form-data'
                          },
                          onUploadProgress: (e) => {
                            progress(e.loaded / e.total * 100);
                          }
                        });
                        
                        // Return the image URL
                        return response.data.location;
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        throw new Error('Image upload failed');
                      }
                    }
                  }}
                />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Separate tags with commas"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter tags separated by commas (e.g., "tech, programming, news")
              </p>
            </div>
            
            {/* Published Status */}
            <div className="flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Publish immediately
              </label>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting 
                  ? (editId ? 'Updating...' : 'Creating...') 
                  : (editId ? 'Update Post' : 'Create Post')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;