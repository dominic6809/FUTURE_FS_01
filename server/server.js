// server/server.js
require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
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
const HTTP_PORT = process.env.PORT || 5000;
const HTTPS_PORT = 443;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://44.211.214.190',
  'https://44.211.214.190',
  'https://d1uk64qtttiyx.cloudfront.net', // If using CloudFront
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

// SSL configuration
const httpsOptions = {
  key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt'),
};

// Start HTTP (optional fallback)
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`🚀 HTTP Server running on port ${HTTP_PORT}`);
});

// Start HTTPS
https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`🔐 HTTPS Server running on port ${HTTPS_PORT}`);
});
