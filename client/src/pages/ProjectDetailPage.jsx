// client/src/pages/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaArrowLeft, 
  FaChevronRight,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL, getImageUrl, IMAGE_PLACEHOLDER } from '../utils/config';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the main project
        const projectResponse = await axios.get(`${API_BASE_URL}/api/projects/${id}`);
        setProject(projectResponse.data);
        
        // Fetch related projects in the same category if possible
        try {
          const category = projectResponse.data.category;
          const relatedResponse = await axios.get(`${API_BASE_URL}/api/projects`, {
            params: { 
              category,
              limit: 3
            }
          });
          
          // Filter out the current project and limit to 3
          setRelatedProjects(
            relatedResponse.data
              .filter(p => p._id !== id)
              .slice(0, 3)
          );
        } catch (relatedError) {
          console.error('Failed to fetch related projects:', relatedError);
          // Continue with the main project even if related projects fail
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err.response?.data?.message || 'Failed to load project details');
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
    // Scroll to top when component mounts or ID changes
    window.scrollTo(0, 0);
  }, [id]);

  // Helper function to prepare technologies array
  const prepareTechnologies = (techData) => {
    if (!techData) return [];
    if (Array.isArray(techData)) return techData;
    if (typeof techData === 'string') return techData.split(',').map(tech => tech.trim());
    return [];
  };

  // Generate full description paragraphs
  const generateDescriptionParagraphs = (project) => {
    if (!project) return [];
    const fullDesc = project.fullDescription || project.description || '';
    
    // Check if there are paragraph breaks
    if (fullDesc.includes('\n\n')) {
      return fullDesc.split('\n\n').filter(p => p.trim() !== '');
    }
    
    // If no paragraph breaks but has newlines
    if (fullDesc.includes('\n')) {
      return fullDesc.split('\n').filter(p => p.trim() !== '');
    }
    
    // Return as single paragraph
    return [fullDesc];
  };

  // Rendering loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Rendering error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-6 flex justify-center">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Something went wrong
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                {error || 'Project not found'}
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Try again
                </button>
                <Link 
                  to="/projects" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Process project data
  const technologies = prepareTechnologies(project.technologies);
  const category = project.category || "Web Application";
  const descriptionParagraphs = generateDescriptionParagraphs(project);
  const hasScreenshots = project.screenshots && project.screenshots.length > 0;
  
  // Get current image source
  const currentImageSrc = hasScreenshots ? 
    project.screenshots[activeImage] : 
    getImageUrl(project.image) || IMAGE_PLACEHOLDER;

  // Get repository link and type
  const repoLink = project.githubLink || project.repositoryLink || null;
  const isGithubRepo = !repoLink ? false : 
    repoLink.includes('github.com') || 
    (project.repositoryType && project.repositoryType.toLowerCase() === 'github');

  return (
    <div className="min-h-screen max-w-3xl mx-auto">
      {/* Back Navigation + Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6 overflow-x-auto whitespace-nowrap">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-500 dark:text-gray-500">/</span>
            <Link 
              to="/projects" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Projects
            </Link>
            <span className="mx-2 text-gray-500 dark:text-gray-500">/</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium truncate max-w-xs">
              {project.title}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative">
              {/* Category Badge - Floating on image */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {category}
                </div>
              </div>
              
              {/* Hero Image */}
              <div className="h-64 sm:h-80 md:h-96 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
                <img 
                  src={currentImageSrc} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = IMAGE_PLACEHOLDER;
                  }}
                />
              </div>
            </div>

            {/* Project Title and Info Section */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                  {project.title}
                </h1>
              </div>
              
              {/* Project Description */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {repoLink && (
                  <a 
                    href={repoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center px-5 py-2.5 rounded-lg transition duration-200 font-medium shadow hover:shadow-md ${
                      isGithubRepo ? 
                        'bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600' :
                        'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600'
                    }`}
                  >
                    {isGithubRepo ? <FaGithub className="mr-2" /> : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isGithubRepo ? 'GitHub Repository' : 'View Code'}
                  </a>
                )}
                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow hover:shadow-md"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Live Demo
                  </a>
                )}
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-10"></div>

              {/* Project Overview */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Project Overview</h2>
                <div className="prose prose-blue max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-5xl mx-auto">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                  Explore Related Projects
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.map((relatedProject) => (
                    <div 
                      key={relatedProject._id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col group"
                    >
                      <div className="h-48 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                        <img 
                          src={getImageUrl(relatedProject.image)} 
                          alt={relatedProject.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = IMAGE_PLACEHOLDER;
                          }}
                        />
                      </div>
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                          {relatedProject.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                          {relatedProject.description}
                        </p>
                        <Link 
                          to={`/projects/${relatedProject._id}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors mt-auto"
                        >
                          View Project
                          <FaChevronRight className="ml-1 text-xs" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-4xl mx-auto">
          <section className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
              <div className="px-6 py-12 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Interested in Working Together?
                </h2>
                <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                  Let's discuss how I can create a custom solution tailored to your specific requirements and vision.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                <Link 
                    to="/contact" 
                    className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                  >
                    Get in Touch
                  </Link>
                  <a 
                    href="mailto:contact@example.com" 
                    className="inline-block px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Send Email
                  </a>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white"></div>
                <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white"></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Back to Projects Button */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            <Link 
              to="/projects" 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;