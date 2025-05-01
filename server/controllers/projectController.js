// server/controllers/projectController.js
const Project = require('../models/Project');
const fs = require('fs').promises;
const path = require('path');

// Get all projects with filtering and sorting
exports.getAllProjects = async (req, res) => {
  try {
    const { category, featured, status, sort = '-featured,-createdAt' } = req.query;
    
    // Build query filters
    const filters = {};
    if (category) filters.category = category;
    if (featured === 'true') filters.featured = true;
    if (status) filters.status = status;
    
    const projects = await Project.find(filters)
      .sort(sort)
      .lean();
      
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single project by ID or slug
exports.getProjectById = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    
    // Try to find by ID first, then by slug if ID fails
    let project;
    
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(idOrSlug);
    } 
    
    if (!project) {
      project = await Project.findOne({ slug: idOrSlug });
    }
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      summary,
      liveLink, 
      repositoryLink,
      repositoryType,
      status,
      featured,
      category,
      startDate,
      endDate 
    } = req.body;
    
    // Process technologies
    let { technologies } = req.body;
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    } else if (Array.isArray(technologies)) {
      technologies = technologies.map(tech => tech.trim()).filter(tech => tech);
    } else {
      technologies = [];
    }

    // Handle image upload
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Create project
    const project = new Project({
      title,
      description,
      summary: summary || description.substring(0, 150) + '...',
      technologies,
      image: imageUrl,
      liveLink: liveLink || '',
      repositoryLink: repositoryLink || '',
      repositoryType: repositoryType || 'github',
      featured: featured === 'true' || featured === true,
      category: category || 'web',
      status: status || 'completed',
      startDate: startDate || null,
      endDate: endDate || null,
      // order: featured === 'true' || featured === true ? 1 : 0
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { 
      title, 
      description,
      summary, 
      liveLink, 
      repositoryLink,
      repositoryType,
      status,
      featured,
      category,
      startDate,
      endDate 
    } = req.body;
    
    // Process technologies
    let { technologies } = req.body;
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    } else if (Array.isArray(technologies)) {
      technologies = technologies.map(tech => tech.trim()).filter(tech => tech);
    } else {
      technologies = [];
    }

    // Build updated fields
    const updatedFields = {
      title,
      description,
      summary: summary || (description ? description.substring(0, 150) + '...' : ''),
      technologies,
      liveLink: liveLink || '',
      repositoryLink: repositoryLink || '',
      repositoryType: repositoryType || 'github',
      featured: featured === 'true' || featured === true,
      category: category || 'web',
      status: status || 'completed',
      startDate: startDate || null,
      endDate: endDate || null,
      // order: featured === 'true' || featured === true ? 1 : 0
    };

    // Handle image update
    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
      
      // Remove old image if exists
      const oldProject = await Project.findById(req.params.id);
      if (oldProject && oldProject.image && oldProject.image !== updatedFields.image) {
        try {
          const imagePath = path.join(__dirname, '../../public', oldProject.image);
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Remove project image if exists
    if (deletedProject.image) {
      try {
        const imagePath = path.join(__dirname, '../../public', deletedProject.image);
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting project image:', error);
      }
    }
    
    res.json({ message: 'Project deleted successfully', id: deletedProject._id });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.featured = !project.featured;
    project.order = project.featured ? 1 : 0;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reorder projects
// exports.reorderProjects = async (req, res) => {
//   try {
//     const { projectOrders } = req.body;
    
//     if (!Array.isArray(projectOrders)) {
//       return res.status(400).json({ message: 'Invalid order data' });
//     }
    
//     // Update orders in bulk
//     const updateOperations = projectOrders.map(item => ({
//       updateOne: {
//         filter: { _id: item.id },
//         update: { $set: { order: item.order } }
//       }
//     }));
    
//     await Project.bulkWrite(updateOperations);
    
//     res.json({ message: 'Projects reordered successfully' });
//   } catch (error) {
//     console.error('Error reordering projects:', error);
//     res.status(500).json({ message: error.message });
//   }
// };