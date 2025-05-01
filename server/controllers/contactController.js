// server/controllers/contactController.js
const Contact = require('../models/Contact');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    const savedContact = await contact.save();

    // EmailJS is handled on the client side
    
    res.status(201).json({ 
      message: 'Message sent successfully', 
      contact: savedContact 
    });
  } catch (error) {
    console.error('Error in submitContactForm:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all contact submissions (protected route)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update contact status (protected route)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error in updateContactStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete contact (protected route)
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error in deleteContact:', error);
    res.status(500).json({ message: error.message });
  }
};