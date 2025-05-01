// server/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  subject: { 
    type: String, 
    required: true, 
    trim: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied', 'resolved'], 
    default: 'unread' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;