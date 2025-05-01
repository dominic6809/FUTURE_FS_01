// src/components/Blog/utils.js
export const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(dateString));
  };
  
  export const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const textLength = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(textLength / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  };
  
  export const sortBlogs = (blogsToSort, sortBy) => {
    switch (sortBy) {
      case 'date-desc':
        return [...blogsToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'date-asc':
        return [...blogsToSort].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'title-asc':
        return [...blogsToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...blogsToSort].sort((a, b) => b.title.localeCompare(a.title));
      case 'popularity':
        return [...blogsToSort].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      default:
        return blogsToSort;
    }
  };
  
  export const getSortLabel = (sortBy) => {
    switch (sortBy) {
      case 'date-desc': return 'Newest First';
      case 'date-asc': return 'Oldest First';
      case 'title-asc': return 'Title A-Z';
      case 'title-desc': return 'Title Z-A';
      case 'popularity': return 'Most Popular';
      default: return 'Sort By';
    }
  };
  
  export const getTrendingTags = (blogs) => {
    const tagCounts = {};
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(entry => entry[0]);
  };