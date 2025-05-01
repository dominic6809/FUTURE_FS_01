// client/src/components/admin/ProjectCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProjectCard = ({ project, apiUrl, onView, onEdit, onDelete, onToggleFeatured }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        {project.image ? (
          <img
            src={`${apiUrl}${project.image}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        {project.featured && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1.5">
            <StarIconSolid className="h-4 w-4" />
          </div>
        )}
        {project.status && (
          <div className="absolute top-2 left-2">
            <span className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${project.status === 'completed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
              ${project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
              ${project.status === 'planned' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
              ${project.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
            `}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {project.title}
        </h3>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.summary || project.description}
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.technologies && project.technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
            {project.technologies && project.technologies.length > 3 && (
              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <button
              onClick={onView}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
              title="View details"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
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
  onClick={onToggleFeatured}
  className={`p-1.5 rounded-md transition-all transform hover:scale-110 ${
    project.featured 
      ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-500' 
      : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
  }`}
  title={project.featured ? "Unmark as featured" : "Mark as featured"}
>
  {project.featured ? 
    <StarIconSolid className="h-5 w-5" /> : 
    <StarIcon className="h-5 w-5" />
  }
</button>
          </div>
          
          <div className="flex space-x-1">
            {project.repositoryLink && project.repositoryLink.trim() !== '' && (
              <a
                href={project.repositoryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
                title={`${project.repositoryType === 'github' ? 'GitHub' : 'Repository'} link`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {project.liveLink && project.liveLink.trim() !== '' && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
                title="Live demo"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleFeatured: PropTypes.func.isRequired
};

export default ProjectCard;