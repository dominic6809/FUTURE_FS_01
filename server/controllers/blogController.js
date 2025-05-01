// server/controllers/blogController.js
const Blog = require('../models/Blog');
const slugify = require('slugify');
const path = require('path');

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    
    const blogsWithImages = blogs.map(blog => {
      const blogObj = blog.toObject();
      // Keep coverImage as is - let frontend handle the URL transformation
      return blogObj;
    });
    
    res.json(blogsWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs (including unpublished) - admin only
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    
    const blogsWithImages = blogs.map(blog => {
      const blogObj = blog.toObject();
      // Keep coverImage as is - let frontend handle the URL transformation
      return blogObj;
    });
    
    res.json(blogsWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('createdBy', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const blogObj = blog.toObject(); 
    res.json(blogObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new blog (protected route)
exports.createBlog = async (req, res) => {
  try {
    // console.log('Create blog request body:', req.body);
    //console.log('File:', req.file);
    
    const { title, content, excerpt, tags, published } = req.body;
    
    // Create slug from title
    let slug = slugify(title, { lower: true });
    
    // Check if slug already exists
    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      // Add unique identifier to slug
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    
    // Process the coverImage if it exists
    let coverImage = null;
    if (req.file) {
      // Store the path with a leading slash to ensure it's properly served
      coverImage = `/uploads/${req.file.filename}`;
      // console.log('Cover image path set to:', coverImage);
    }
    
    // Process tags - handle both string and array formats
    let processedTags = [];
    if (tags) {
      processedTags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()) 
        : tags;
    }
    
    const blog = new Blog({
      title,
      content,
      excerpt,
      coverImage,
      tags: processedTags,
      createdBy: req.user.id,
      slug,
      published: published !== undefined ? (published === 'true' || published === true) : true
    });
    
    const savedBlog = await blog.save();
    
    // Return the blog object as is
    const blogResponse = savedBlog.toObject();
    
    res.status(201).json(blogResponse);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update blog (protected route)
exports.updateBlog = async (req, res) => {
  try {
    // console.log('Update blog request body:', req.body);
    // console.log('File:', req.file);
    
    const { title, content, excerpt, tags, published } = req.body;
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is authorized
    if (blog.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    // Update slug only if title changed
    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = slugify(title, { lower: true });
      
      // Check if new slug already exists (except current blog)
      const existingSlug = await Blog.findOne({ slug, _id: { $ne: blog._id } });
      if (existingSlug) {
        // Add unique identifier to slug
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }
    
    // Process the coverImage if it exists
    let coverImage = blog.coverImage;
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
      // console.log('Updated cover image path:', coverImage);
    }
    
    // Process tags - handle both string and array formats
    let processedTags = blog.tags;
    if (tags) {
      processedTags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()) 
        : tags;
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title || blog.title,
        content: content || blog.content,
        excerpt: excerpt || blog.excerpt,
        coverImage,
        tags: processedTags,
        slug,
        published: published !== undefined ? (published === 'true' || published === true) : blog.published
      },
      { new: true }
    ).populate('createdBy', 'username');
    
    // Return the blog object as is
    const blogResponse = updatedBlog.toObject();
    
    res.json(blogResponse);
  } catch (error) {
    // console.error('Blog update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete blog (protected route)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is authorized
    if (blog.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};