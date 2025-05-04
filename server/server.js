// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contact');
const { authenticateToken } = require('./middleware/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://44.211.214.190',  // EC2 public IP
  'https://d1uk64qtttiyx.cloudfront.net', // CloudFront domain
  // Add any other domains you need here, like:
  // 'https://yourdomain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
  credentials: true,  // Enable credentials for cookie/session support if needed
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// absolute path to uploads directory
const uploadsPath = path.join(__dirname, 'uploads');

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsPath));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
