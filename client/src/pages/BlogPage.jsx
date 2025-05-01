// src/pages/BlogPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogHero from '../components/Blog/BlogHero';
import BlogCard from '../components/Blog/BlogCard';
import BlogEmptyState from '../components/Blog/BlogEmptyState';
import LoadingSkeleton from '../components/Blog/LoadingSkeleton';
import { 
  FilterButton, 
  FilterPanel, 
  ActiveFilters,
  SortDropdown, 
  LayoutToggle, 
  TrendingTags 
} from '../components/Blog/BlogFilters';
import { sortBlogs, getTrendingTags } from '../components/Blog/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const BlogPage = () => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [allTags, setAllTags] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  
  const blogListRef = useRef(null);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortOptions && !event.target.closest('.sort-dropdown')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortOptions]);

  // Fetch blogs data
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
        
        // Extract all unique tags
        const tags = new Set();
        data.forEach(blog => {
          if (blog.tags) {
            blog.tags.forEach(tag => tags.add(tag));
          }
        });
        
        setAllTags(Array.from(tags).sort());
        setTrendingTags(getTrendingTags(data));
        setFilteredBlogs(sortBlogs(data, sortBy));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (blogs.length === 0) return;

    let filtered = [...blogs];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(search) || 
        blog.excerpt.toLowerCase().includes(search) || 
        (blog.content && blog.content.toLowerCase().includes(search))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => 
        blog.tags && selectedTags.every(tag => blog.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered = sortBlogs(filtered, sortBy);
    
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedTags, sortBy]);

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('date-desc');
  };

  // Handle search submissions
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (blogListRef.current) {
      blogListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine if filters are active
  const hasFilters = searchTerm || selectedTags.length > 0 || sortBy !== 'date-desc';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <BlogHero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchSubmit={handleSearchSubmit}
        blogListRef={blogListRef}
      />
      
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <TrendingTags 
              trendingTags={trendingTags} 
              selectedTags={selectedTags} 
              onTagSelect={handleTagSelect} 
            />
            
            <div className="flex items-center space-x-2">
              <FilterButton 
                filterOpen={filterOpen} 
                setFilterOpen={setFilterOpen} 
                selectedTags={selectedTags} 
              />
              
              <div className="sort-dropdown">
                <SortDropdown 
                  sortBy={sortBy} 
                  setSortBy={setSortBy} 
                  showSortOptions={showSortOptions} 
                  setShowSortOptions={setShowSortOptions} 
                />
              </div>
              
              <LayoutToggle layout={layout} setLayout={setLayout} />
            </div>
          </div>
          
          <FilterPanel 
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            allTags={allTags}
            selectedTags={selectedTags}
            handleTagSelect={handleTagSelect}
            clearFilters={clearFilters}
          />
          
          <ActiveFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTags={selectedTags}
            handleTagSelect={handleTagSelect}
            clearFilters={clearFilters}
            sortBy={sortBy}
          />
        </div>
        
        <div ref={blogListRef}>
          {loading ? (
            <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              <LoadingSkeleton layout={layout} />
            </div>
          ) : filteredBlogs.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
            >
              <AnimatePresence>
                {filteredBlogs.map((blog) => (
                  <BlogCard 
                    key={blog.id} 
                    blog={blog} 
                    layout={layout}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <BlogEmptyState clearFilters={clearFilters} hasFilters={hasFilters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;