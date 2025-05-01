// client/src/components/admin/ProjectDetails.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { 
  XMarkIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon,
  LinkIcon,
  TagIcon,
  StarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProjectDetails = ({ project, apiUrl, onClose, onEdit, onDelete }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get category display name
  const getCategoryName = (categorySlug) => {
    const categories = {
      'web': 'Web Development',
      'mobile': 'Mobile Development',
      'desktop': 'Desktop Application',
      'backend': 'Backend System',
      'ai-ml': 'AI/Machine Learning',
      'ui-ux': 'UI/UX Design',
      'other': 'Other'
    };
    return categories[categorySlug] || categorySlug;
  };

  // Get repository type display name
  const getRepositoryTypeName = (repoType) => {
    const repoTypes = {
      'github': 'GitHub',
      'gitlab': 'GitLab',
      'bitbucket': 'Bitbucket',
      'other': 'Other'
    };
    return repoTypes[repoType] || repoType;
  };

  // Format status for display
  const getStatusDisplay = (status) => {
    return status ? status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Details
          </h3>
          {project.featured && (
            <span className="ml-2 inline-flex items-center bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-medium px-2 py-0.5 rounded-full">
              <StarIconSolid className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          {project.status && project.status !== 'completed' && (
            <span className={`
              ml-2 text-xs px-2 py-0.5 rounded-full font-medium
              ${project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
              ${project.status === 'planned' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
              ${project.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
            `}>
              {getStatusDisplay(project.status)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md transition-colors"
            title="Edit project"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
            title="Delete project"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column with image */}
          <div className="md:col-span-1">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
              {project.image ? (
                <img
                  src={`${apiUrl}${project.image}`}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Project metadata */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <TagIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">{getCategoryName(project.category)}</span>
              </div>
              
              {project.startDate && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    {formatDate(project.startDate)}
                    {project.endDate && ` - ${formatDate(project.endDate)}`}
                    {!project.endDate && project.status === 'in-progress' && " - Present"}
                  </span>
                </div>
              )}
              
              {project.repositoryLink && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <a 
                    href={project.repositoryLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {getRepositoryTypeName(project.repositoryType)} Repository
                  </a>
                </div>
              )}
              
              {project.liveLink && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Live Demo
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right column with details */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {project.title}
            </h2>
            
            {project.summary && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</h3>
                <p className="text-gray-600 dark:text-gray-400">{project.summary}</p>
              </div>
            )}
            
            {project.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h3>
                <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional project metadata could be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ProjectDetails;