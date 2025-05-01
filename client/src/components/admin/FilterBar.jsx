// client/src/components/admin/FilterBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FunnelIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

const FilterBar = ({ filters, sortBy, onFilterChange, onSortChange }) => {
  const handleReset = () => {
    onFilterChange('category', '');
    onFilterChange('featured', '');
    onFilterChange('status', '');
    onSortChange('-featured,-createdAt');
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'desktop', label: 'Desktop Application' },
    { value: 'backend', label: 'Backend System' },
    { value: 'ai', label: 'AI/Machine Learning' },
    { value: 'ui', label: 'UI/UX Design' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' },
    { value: 'archived', label: 'Archived' }
  ];

  const featuredOptions = [
    { value: '', label: 'All Projects' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Not Featured' }
  ];

  const sortOptions = [
    { value: '-featured,-createdAt', label: 'Featured, Newest First' },
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: '-title', label: 'Title (Z-A)' },
    { value: '-startDate', label: 'Latest Start Date' },
    { value: 'startDate', label: 'Earliest Start Date' }
  ];

  const isFiltered = filters.category || filters.featured || filters.status || sortBy !== '-featured,-createdAt';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="flex items-center text-gray-700 dark:text-gray-300 font-normal mb-4 md:mb-0">
          {/* <FunnelIcon className="h-5 w-5 mr-2" /> */}
          Filter & Sort Projects
        </h3>
        {isFiltered && (
          <button 
            onClick={handleReset}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FunnelIcon className="h-4 w-4 inline mr-1" />
            Category
          </label>
          <select
            id="categoryFilter"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FunnelIcon className="h-4 w-4 inline mr-1" />
            Status
          </label>
          <select
            id="statusFilter"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <label htmlFor="featuredFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FunnelIcon className="h-4 w-4 inline mr-1" />
            Featured
          </label>
          <select
            id="featuredFilter"
            value={filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {featuredOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <ArrowsUpDownIcon className="h-4 w-4 inline mr-1" />
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    featured: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  sortBy: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default FilterBar;