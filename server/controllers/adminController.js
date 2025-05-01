// server/controllers/adminController.js
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const projectCount = await Project.countDocuments();
    const blogPostCount = await Blog.countDocuments();
    const messageCount = await Contact.countDocuments();
    
    // Get new counts (created in the last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newProjectCount = await Project.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const newBlogPostCount = await Blog.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const newMessageCount = await Contact.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Get recent activity (last 10 items)
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title description createdAt');
      
    const recentBlogPosts = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title excerpt createdAt');
      
    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message createdAt');

    // Format recent activity
    const recentActivity = [
      ...recentProjects.map(project => ({
        type: 'project',
        title: project.title,
        description: project.description ? project.description.substring(0, 100) + '...' : 'New project added',
        date: project.createdAt
      })),
      ...recentBlogPosts.map(post => ({
        type: 'blog',
        title: post.title,
        description: post.excerpt ? post.excerpt.substring(0, 100) + '...' : 'New blog post published',
        date: post.createdAt
      })),
      ...recentMessages.map(message => ({
        type: 'message',
        title: `Message from ${message.name}`,
        description: message.message ? message.message.substring(0, 100) + '...' : 'New contact message received',
        date: message.createdAt
      }))
    ];

    // Sort by date, newest first
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take only the 10 most recent activities
    const limitedRecentActivity = recentActivity.slice(0, 10);

    // Return stats
    res.json({
      projects: projectCount,
      blogPosts: blogPostCount,
      messages: messageCount,
      newProjects: newProjectCount,
      newBlogPosts: newBlogPostCount,
      newMessages: newMessageCount,
      recentActivity: limitedRecentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};