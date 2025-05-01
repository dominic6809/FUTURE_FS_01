// client/src/components/admin/ProjectForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProjectForm = ({ formData, onSubmit, onInputChange, onFileChange, onCancel, isEdit }) => {
  const categoryOptions = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'desktop', label: 'Desktop Application' },
    { value: 'backend', label: 'Backend System' },
    { value: 'ai', label: 'AI/Machine Learning' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' },
    { value: 'archived', label: 'Archived' }
  ];

  const repositoryOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'gitlab', label: 'GitLab' }, 
    { value: 'bitbucket', label: 'Bitbucket' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
              placeholder="Project title"
            />
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Summary *
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
              placeholder="A brief summary of the project"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Detailed description of the project"
            />
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies *
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
              placeholder="React, Node.js, MongoDB, etc."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Comma-separated list of technologies used
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Image
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 flex items-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Choose file</span>
              </label>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                {formData.imageName || formData.imageUrl ? 
                  (formData.imageName || formData.imageUrl.split('/').pop()) : 
                  'No file selected'}
              </span>
              {(formData.imageName || formData.imageUrl) && (
                <button
                  type="button"
                  onClick={() => onInputChange({ 
                    target: { 
                      name: 'image', 
                      value: null,
                      type: 'file'
                    } 
                  })}
                  className="ml-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            {formData.imageUrl && !formData.imageName && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Current image will be kept unless you select a new one
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Links */}
          <div>
            <label htmlFor="repositoryLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Repository Link
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative inline-flex items-stretch flex-grow focus-within:z-10">
                <input
                  type="url"
                  id="repositoryLink"
                  name="repositoryLink"
                  value={formData.repositoryLink}
                  onChange={onInputChange}
                  className="block w-full rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <select
                id="repositoryType"
                name="repositoryType"
                value={formData.repositoryType}
                onChange={onInputChange}
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-sm text-gray-500 dark:text-gray-300"
              >
                {repositoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Live Demo Link
            </label>
            <input
              type="url"
              id="liveLink"
              name="liveLink"
              value={formData.liveLink}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="https://example.com"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={onInputChange}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-600"
            />
            <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Project
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

ProjectForm.defaultProps = {
  isEdit: false
};

export default ProjectForm;