// client/src/pages/ProjectsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/config';

// Import icons
import {
  FiArrowRight,
  FiSearch,
  FiGrid,
  FiList,
  FiGithub,
  FiExternalLink,
  FiFilter,
  FiStar,
  FiRefreshCw
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('-createdAt');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Sort options
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: '-title', label: 'Title (Z-A)' },
  ];

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsRetrying(true);

      // Build query parameters for filtering and sorting
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('category', filter);
      params.append('sort', sortOption);

      const response = await axios.get(`${API_URL}/api/projects?${params.toString()}`);
      const projectsData = response.data;

      // Extract unique categories from projects
      const uniqueCategories = ['all'];

      projectsData.forEach(project => {
        if (project.category && !uniqueCategories.includes(project.category)) {
          uniqueCategories.push(project.category);
        }
      });

      setCategories(uniqueCategories);
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('API fetch error:', err);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [filter, statusFilter, sortOption]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects based on search term
  useEffect(() => {
    if (!projects.length) return;

    let results = [...projects];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(project =>
        project.title?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        (Array.isArray(project.technologies) &&
          project.technologies.some(tech => tech.toLowerCase().includes(term)))
      );
    }

    setFilteredProjects(results);
  }, [searchTerm, projects]);

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getFeaturedProjects = () => {
    return projects.filter(project => project.featured).slice(0, 3);
  };

  // Helper function to get proper image URL
  const getProjectImageUrl = (project) => {
    if (project.image) {
      return getImageUrl(project.image);
    } else {
      return `https://via.placeholder.com/600x300?text=${encodeURIComponent(project.title || 'Project')}`;
    }
  };

  // Get repository icon based on repository type
  const getRepositoryIcon = (repositoryType) => {
    switch (repositoryType?.toLowerCase()) {
      case 'gitlab':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path></svg>;
      case 'bitbucket':
        return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M1.81 2C1.36 2 .97 2.36.97 2.81c0 .06 0 .12.02.18l3.23 19.8c.08.5.51.87 1.02.87h13.54c.38 0 .71-.26.8-.63l3.26-20.02c.07-.45-.24-.87-.69-.94-.04-.01-.08-.01-.13-.01zM14.51 17.76H9.48l-1.26-6.67h7.53z"></path></svg>;
      default: // GitHub
        return <FiGithub />;
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section - Modern design with gradient and pattern */}
      <section className="relative py-24 overflow-hidden -mt-14">
        {/* Background pattern (visible in light mode) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-0"></div>

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 opacity-70 dark:opacity-100"></div>

        {/* Content */}
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto">
            <h5 className="text-blue-600 dark:text-blue-400 font-mono mb-3 tracking-wide uppercase">Portfolio Showcase</h5>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
              Crafting Digital <span className="text-blue-600 dark:text-blue-400">Experiences</span> Through Code
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl">
              Explore my collection of projects showcasing innovative solutions across web development,
              design, and application architecture.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#featured-projects"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Explore Projects
              </a>
              <Link
                to="/contact"
                className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium rounded-lg hover:bg-blue-600/10 transition duration-200"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured-projects" className="py-20 bg-white dark:bg-gray-800 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A selection of my best work, showcasing technical expertise and creative problem-solving.
            </p>
          </div>

          {/* Featured Projects Display */}
          {!isLoading && !error && getFeaturedProjects().length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {getFeaturedProjects().map((project) => (
                <div
                  key={project._id}
                  className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <img
                      src={getProjectImageUrl(project)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/600x300?text=${encodeURIComponent(project.title || 'Project')}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="w-full">
                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/projects/${project._id}`}
                            className="inline-flex items-center text-blue-400 hover:text-white transition-colors"
                          >
                            View Project <FiArrowRight className="ml-1" />
                          </Link>
                          <div className="flex items-center space-x-3">
                            {project.repositoryLink && (
                              <a
                                href={project.repositoryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-200 hover:text-white transition-colors"
                                title="View Code Repository"
                              >
                                {getRepositoryIcon(project.repositoryType)}
                              </a>
                            )}
                            {project.liveLink && (
                              <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-200 hover:text-white transition-colors"
                                title="View Live Demo"
                              >
                                <FiExternalLink />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md flex items-center">
                      <FiStar size={12} className="mr-1" /> Featured
                    </span>
                  </div>
                  {/* {project.status && (
                    <div className="absolute top-4 left-4 z-10">
                      {getStatusBadge(project.status)}
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}

          {/* No Featured Projects */}
          {!isLoading && !error && getFeaturedProjects().length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>No featured projects available at the moment.</p>
            </div>
          )}

          {/* Loading State for Featured Projects */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </section>

      {/* All Projects Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">All Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mb-12"></div>

            {/* Search, Filter, and Sort Controls */}
            <div className="mb-12">
              {/* Search Input */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects by name, description, or technology..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white shadow-sm"
                />
              </div>

              {/* Filters and Sort Controls */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <button
                    onClick={toggleFilterMenu}
                    className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 sm:mb-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="flex items-center">
                      <FiFilter className="mr-2" /> Filters
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full ml-2">
                      {(filter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) || 0}
                    </span>
                  </button>

                  <div className="flex items-center space-x-4">
                    {/* Sort Dropdown */}
                    <div className="relative flex-grow sm:flex-grow-0 sm:max-w-xs">
                      <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-0 bottom-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                          }`}
                        aria-label="Grid view"
                      >
                        <FiGrid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                          }`}
                        aria-label="List view"
                      >
                        <FiList size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Options - Collapsible */}
                {isFilterMenuOpen && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Category Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Category</h4>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => handleFilterChange(category)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${filter === category
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
              </div>
            )}

            {/* Error State with Retry Button */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 text-center">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                  Unable to load projects
                </h3>
                <p className="text-red-600 dark:text-red-400 mb-6">
                  {error}
                </p>
                <button
                  onClick={fetchProjects}
                  disabled={isRetrying}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
                >
                  {isRetrying ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" /> Retrying...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="mr-2" /> Try Again
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Grid View for Projects */}
            {!isLoading && !error && filteredProjects.length > 0 && viewMode === 'grid' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={getProjectImageUrl(project)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/600x300?text=${encodeURIComponent(project.title || 'Project')}`;
                        }}
                      />
                      {project.featured && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded-full shadow-sm flex items-center">
                          <FiStar className="mr-1" size={10} /> Featured
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="text-sm text-blue-300 font-medium">
                          {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : 'Web Application'}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : (typeof project.technologies === 'string'
                            ? project.technologies.split(',').map(tech => tech.trim())
                            : [])).slice(0, 4).map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                        {Array.isArray(project.technologies) && project.technologies.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/projects/${project._id}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          View Details <FiArrowRight className="ml-2" />
                        </Link>
                        <div className="flex space-x-3">
                          {project.repositoryLink && (
                            <a
                              href={project.repositoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                              title="View Code Repository"
                            >
                              {getRepositoryIcon(project.repositoryType)}
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                              title="View Live Demo"
                            >
                              <FiExternalLink />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View for Projects */}
            {!isLoading && !error && filteredProjects.length > 0 && viewMode === 'list' && (
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row"
                  >
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img
                        src={getProjectImageUrl(project)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/600x300?text=${encodeURIComponent(project.title || 'Project')}`;
                        }}
                      />
                      {project.featured && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded-full shadow-sm flex items-center">
                          <FiStar className="mr-1" size={10} /> Featured
                        </div>
                      )}
                      {project.status && (
                        <div className="absolute top-3 left-3">
                          {/* {getStatusBadge(project.status)} */}
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:w-3/4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : 'Web Application'}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(Array.isArray(project.technologies)
                            ? project.technologies
                            : (typeof project.technologies === 'string'
                              ? project.technologies.split(',').map(tech => tech.trim())
                              : [])).map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <Link
                          to={`/projects/${project._id}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          View Details <FiArrowRight className="ml-2" />
                        </Link>
                        <div className="flex space-x-3">
                          {project.repositoryLink && (
                            <a
                              href={project.repositoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                              title="View Code Repository"
                            >
                              {getRepositoryIcon(project.repositoryType)}
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                              title="View Live Demo"
                            >
                              <FiExternalLink />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Projects Found State */}
            {!isLoading && !error && filteredProjects.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? `No projects match your search for "${searchTerm}"`
                    : filter !== 'all' || statusFilter !== 'all'
                      ? 'No projects match your selected filters'
                      : 'No projects available at the moment'}
                </p>
                {(searchTerm || filter !== 'all' || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                      setStatusFilter('all');
                    }}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiRefreshCw className="mr-2" /> Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-blue-600 text-white relative overflow-hidden rounded-3xl my-8 mx-auto max-w-5xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white"></div>
          <div className="absolute right-20 top-40 h-40 w-40 rounded-full bg-white"></div>
          <div className="absolute left-60 bottom-10 h-20 w-20 rounded-full bg-white"></div>
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-white"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to collaborate on your next project?</h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-lg hover:bg-blue-50 transition duration-200"
              >
                Contact Me
              </Link>
              <a
                href="#featured-projects"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transition duration-200"
              >
                View More Projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;