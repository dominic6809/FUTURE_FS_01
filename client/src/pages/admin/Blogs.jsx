// client/src/pages/admin/Blogs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  ArrowPathIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Component imports
import BlogCard from '../../components/admin/blogs/BlogCard';
import BlogFormModal from '../../components/admin/blogs/BlogFormModal';
import PreviewModal from '../../components/admin/blogs/PreviewModal';
import DeleteModal from '../../components/admin/blogs/DeleteModal';
import EmptyState from '../../components/admin/blogs/EmptyState';
import LoadingState from '../../components/shared/LoadingState';
import Header from '../../components/admin/blogs/Header';
import FilterPanel from '../../components/admin/blogs/FilterPanel';

const Blogs = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalType, setModalType] = useState(null); // 'create', 'edit', 'preview', 'delete'
  const [editId, setEditId] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    published: 'all', // 'all', 'published', 'draft'
    sortBy: 'newest', // 'newest', 'oldest', 'a-z', 'z-a'
    tags: []
  });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: null,
    coverImageUrl: '',
    tags: '',
    published: true
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blogs/admin', {
        headers: getAuthHeader()
      });
      setBlogs(response.data);
      applyFiltersAndSearch(response.data, searchQuery, filters);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Apply filters and search
  const applyFiltersAndSearch = (blogsData, query, filterOptions) => {
    let results = [...blogsData];
    
    // Search filter
    if (query) {
      const searchTerms = query.toLowerCase();
      results = results.filter(blog => 
        blog.title.toLowerCase().includes(searchTerms) || 
        blog.excerpt.toLowerCase().includes(searchTerms) ||
        blog.content.toLowerCase().includes(searchTerms) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerms)))
      );
    }
    
    // Publication status filter
    if (filterOptions.published !== 'all') {
      const isPublished = filterOptions.published === 'published';
      results = results.filter(blog => blog.published === isPublished);
    }
    
    // Tag filter
    if (filterOptions.tags && filterOptions.tags.length > 0) {
      results = results.filter(blog => 
        blog.tags && filterOptions.tags.some(tag => blog.tags.includes(tag))
      );
    }
    
    // Sorting
    switch (filterOptions.sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        results.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredBlogs(results);
  };

  useEffect(() => {
    applyFiltersAndSearch(blogs, searchQuery, filters);
  }, [searchQuery, filters]);

  const resetForm = () => {
    // Revoke any objectURL to prevent memory leaks
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: null,
      coverImageUrl: '',
      previewUrl: null,
      tags: '',
      published: true
    });
    setEditId(null);
  };

  const handleEdit = (blog) => {
    // Revoke any existing preview URL to prevent memory leaks
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      coverImage: null,  // Reset file input
      coverImageUrl: blog.coverImage || '',  // Store the server path
      tags: blog.tags?.join(', ') || '',
      published: blog.published
    });
    setEditId(blog._id);
    setModalType('edit');
  };

  const confirmDelete = (blog) => {
    setDeleteTarget(blog);
    setModalType('delete');
  };

  const handlePreview = (blog) => {
    setPreviewBlog(blog);
    setModalType('preview');
  };

  const closeModal = () => {
    setModalType(null);
    setPreviewBlog(null);
    setDeleteTarget(null);
    if (modalType === 'create' || modalType === 'edit') {
      resetForm();
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Helper to extract all unique tags from blogs
  const getAllTags = () => {
    const tagSet = new Set();
    blogs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header 
        onNewPost={() => {
          resetForm();
          setModalType('create');
        }}
        onRefresh={() => {
          setRefreshing(true);
          fetchBlogs();
        }}
        isRefreshing={refreshing}
      />
      
      {/* Search and Filter Bar */}
      <div className="mt-6 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search blogs by title, content or tags..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={toggleFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <FilterPanel 
            filters={filters} 
            onChange={handleFilterChange} 
            availableTags={getAllTags()} 
          />
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <LoadingState />
        ) : filteredBlogs.length === 0 ? (
          searchQuery || (filters.published !== 'all') || (filters.tags.length > 0) ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No blog posts match your search criteria</p>
            </div>
          ) : (
            <EmptyState onNewPost={() => setModalType('create')} />
          )
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard 
                key={blog._id} 
                blog={blog} 
                onEdit={() => handleEdit(blog)}
                onDelete={() => confirmDelete(blog)}
                onPreview={() => handlePreview(blog)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType === 'create' || modalType === 'edit' ? (
        <BlogFormModal 
          formData={formData}
          setFormData={setFormData}
          editId={editId}
          onClose={closeModal}
          onSuccess={fetchBlogs}
          getAuthHeader={getAuthHeader}
        />
      ) : null}
      
      {modalType === 'preview' ? (
        <PreviewModal blog={previewBlog} onClose={closeModal} />
      ) : null}
      
      {modalType === 'delete' ? (
        <DeleteModal 
          blog={deleteTarget} 
          onClose={closeModal} 
          onDelete={async () => {
            try {
              await axios.delete(`/api/blogs/${deleteTarget._id}`, {
                headers: getAuthHeader()
              });
              toast.success('Blog post deleted successfully');
              fetchBlogs();
              closeModal();
            } catch (error) {
              console.error('Error deleting blog post:', error);
              toast.error('Failed to delete blog post');
            }
          }}
        />
      ) : null}
    </div>
  );
};

export default Blogs;