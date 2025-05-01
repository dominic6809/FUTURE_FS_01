// server/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: true 
  },
  summary: {
    type: String,
    trim: true
  },
  image: { 
    type: String, 
    required: false 
  },
  technologies: [{ 
    type: String, 
    required: true 
  }],
  liveLink: { 
    type: String, 
    default: '' 
  },
  repositoryLink: { 
    type: String, 
    default: '' 
  },
  repositoryType: {
    type: String,
    enum: ['github', 'gitlab', 'bitbucket', 'other'],
    default: 'github'
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  category: { 
    type: String, 
    enum: ['web', 'mobile', 'desktop', 'ai', 'blockchain', 'game', 'other', 'library', 'api', 'backend', 'ui'], 
    default: 'web' 
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'archived', 'planned'],
    default: 'completed'
  },
  startDate: { 
    type: Date, 
    default: null 
  },
  endDate: { 
    type: Date, 
    default: null 
  },
  // order: {
  //   type: Number,
  //   default: 0
  // },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Generate slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;