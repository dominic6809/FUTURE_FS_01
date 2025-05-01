// client/src/pages/admin/Projects.jsx
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  FolderPlusIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Components
import ProjectCard from '../../components/admin/ProjectCard';
import ProjectForm from '../../components/admin/ProjectForm';
import ProjectDetails from '../../components/admin/ProjectDetails';
import EmptyState from '../../components/common/project/EmptyState';
import Loader from '../../components/common/Loader';
import FilterBar from '../../components/admin/FilterBar';

const API_URL = import.meta.env.VITE_API_URL;

const Projects = () => {
  const { getAuthHeader } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    featured: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('-featured,-createdAt');
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    technologies: '',
    image: null,
    imageUrl: '',
    imageName: '',
    repositoryLink: '',
    repositoryType: 'github',
    liveLink: '',
    featured: false,
    category: 'web',
    status: 'completed',
    startDate: '',
    endDate: ''
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.featured) queryParams.append('featured', filters.featured);
      if (filters.status) queryParams.append('status', filters.status);
      if (sortBy) queryParams.append('sort', sortBy);
      
      const response = await axios.get(`/api/projects?${queryParams.toString()}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters, sortBy]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      summary: '',
      technologies: '',
      image: null,
      imageUrl: '',
      imageName: '',
      repositoryLink: '',
      repositoryType: 'github',
      liveLink: '',
      featured: false,
      category: 'web',
      status: 'completed',
      startDate: '',
      endDate: ''
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const projectData = new FormData();
      
      // Append form data fields
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          // Only append image if it exists
          if (formData.image) {
            projectData.append('image', formData.image);
          }
        } else if (key === 'technologies') {
          // Handle technologies as a comma-separated string
          projectData.append('technologies', formData.technologies);
        } else if (key === 'featured') {
          // Convert boolean to string for FormData
          projectData.append('featured', formData.featured.toString());
        } else if (formData[key] !== null && formData[key] !== undefined) {
          // Append all other fields that have values
          projectData.append(key, formData[key]);
        }
      });
      
      if (editId) {
        // Update existing project
        await axios.put(`/api/projects/${editId}`, projectData, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await axios.post('/api/projects', projectData, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Project created successfully');
      }
      
      fetchProjects();
      resetForm();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ 
        ...formData, 
        image: e.target.files[0],
        imageName: e.target.files[0].name 
      });
    }
  };

  const handleEdit = (project) => {
    // Map project fields to form data fields
    setFormData({
      title: project.title || '',
      description: project.description || '',
      summary: project.summary || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      image: null,
      imageUrl: project.image || '',
      imageName: '',
      repositoryLink: project.repositoryLink || '',
      repositoryType: project.repositoryType || 'github',
      liveLink: project.liveLink || '',
      featured: project.featured || false,
      category: project.category || 'web',
      status: project.status || 'completed',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
    });
    setEditId(project._id);
    setIsFormModalOpen(true);
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: getAuthHeader()
        });
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      // Update local state immediately for better UX
      const updatedProjects = projects.map(project => {
        if (project._id === id) {
          return {
            ...project,
            featured: !project.featured
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      
      // Make API call to update backend
      const response = await axios.patch(`/api/projects/${id}/toggle-featured`, {}, {
        headers: getAuthHeader()
      });
      
      // Show success message
      toast.success(`Project ${currentFeatured ? 'unfeatured' : 'featured'} successfully`);
      
      // Optional: If you need to ensure consistency with backend sorting
      // or if the API returns additional data, you could refetch
      if (sortBy.includes('featured')) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update project status');
      
      // Revert local state if API call fails
      const originalProjects = [...projects]; // Create a copy to avoid state issues
      setProjects(originalProjects);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Filter projects"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsFormModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Project
          </button>
        </div>
      </div>

      {/* Filter Bar - Collapsible */}
      <Transition
        show={isFilterBarOpen}
        as="div"
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <FilterBar 
          filters={filters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </Transition>

      {loading ? (
        <Loader message="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState 
          icon={<FolderPlusIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
          title="No projects yet"
          description="Start showcasing your work by adding your first project."
          action={{
            label: "Create First Project",
            icon: <PlusIcon className="h-5 w-5 mr-1" />,
            onClick: () => {
              resetForm();
              setIsFormModalOpen(true);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id}
              project={project}
              apiUrl={API_URL}
              onView={() => handleView(project)}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project._id)}
              onToggleFeatured={() => handleToggleFeatured(project._id, project.featured)}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <Transition appear show={isFormModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setIsFormModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editId ? 'Edit Project' : 'Add New Project'}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsFormModalOpen(false)}
                      className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <ProjectForm 
                    formData={formData}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onCancel={() => {
                      setIsFormModalOpen(false);
                      resetForm();
                    }}
                    isEdit={!!editId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Project View Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setIsViewModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {selectedProject && (
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                    <ProjectDetails 
                      project={selectedProject}
                      apiUrl={API_URL}
                      onClose={() => setIsViewModalOpen(false)}
                      onEdit={() => {
                        handleEdit(selectedProject);
                        setIsViewModalOpen(false);
                      }}
                      onDelete={() => {
                        setIsViewModalOpen(false);
                        setTimeout(() => handleDelete(selectedProject._id), 300);
                      }}
                    />
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Projects;