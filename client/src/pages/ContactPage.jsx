// client/src/pages/ContactPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    from_subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });
  
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Initial theme detection
    const detectTheme = () => {
      // Option 1: Check for theme class on document element
      if (document.documentElement.classList.contains('dark')) {
        setTheme('dark');
        return;
      }
      
      // Option 2: Check for theme data attribute
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        setTheme('dark');
        return;
      }
      
      // Option 3: Check localStorage
      if (localStorage.getItem('theme') === 'dark') {
        setTheme('dark');
        return;
      }
      
      setTheme('light');
    };
    
    // Call initially
    detectTheme();
    
    // Set up a MutationObserver to watch for theme changes on the document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')
        ) {
          detectTheme();
        }
      });
    });
    
    // Start observing the document element for class or data-theme attribute changes
    observer.observe(document.documentElement, { attributes: true });
    
    // Also listen for storage events for theme changes via localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        detectTheme();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.from_name.trim()) {
      newErrors.from_name = 'Name is required';
    }
    
    if (!formData.from_email.trim()) {
      newErrors.from_email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.from_email)) {
      newErrors.from_email = 'Invalid email address';
    }
    
    if (!formData.from_subject.trim()) {
      newErrors.from_subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // 1. Send email using EmailJS with Vite env variables
      const emailResult = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      console.log('EmailJS response:', emailResult.text);
      
      // Map form data to match backend expected fields
      const contactData = {
        name: formData.from_name,
        email: formData.from_email,
        subject: formData.from_subject,
        message: formData.message
      };
      
      const apiResponse = await axios.post('/api/contact', contactData);
      
      // Show success modal
      setModalContent({
        title: 'Message Sent!',
        message: 'Thank you for your message. I will get back to you as soon as possible!',
        type: 'success'
      });
      setShowModal(true);
      
      // Reset form
      setFormData({
        from_name: '',
        from_email: '',
        from_subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show error modal
      setModalContent({
        title: 'Message Failed',
        message: 'There was a problem sending your message. Please try again later.',
        type: 'error'
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-16 -mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={`text-2xl md:text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Get In Touch
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Have a question or want to work together? Fill out the form or reach out directly through one of my contact channels.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/3"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-lg p-8 h-full border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-semibold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-start group"
                >
                  <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-4 rounded-xl group-hover:bg-blue-600 transition-colors duration-300`}>
                    <FaEnvelope className={`text-xl ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'} group-hover:text-white`} />
                  </div>
                  <div className="ml-5">
                    <h3 className={`font-medium text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Email</h3>
                    <a href="mailto:muuomusyoki018@gmail,com" className="text-blue-500 hover:underline">
                      muuomusyoki018@gmail.com
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-start group"
                >
                  <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-4 rounded-xl group-hover:bg-blue-600 transition-colors duration-300`}>
                    <FaPhone className={`text-xl ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'} group-hover:text-white`} />
                  </div>
                  <div className="ml-5">
                    <h3 className={`font-medium text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Phone</h3>
                    <a href="tel:+1234567890" className="text-blue-500 hover:underline">
                      (+254) 742 899959
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-start group"
                >
                  <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-4 rounded-xl group-hover:bg-blue-600 transition-colors duration-300`}>
                    <FaMapMarkerAlt className={`text-xl ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'} group-hover:text-white`} />
                  </div>
                  <div className="ml-5">
                    <h3 className={`font-medium text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Location</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nairobi, Kenya
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-12">
                <h3 className={`font-medium text-lg mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Connect With Me
                </h3>
                <div className="flex space-x-4">
                  <motion.a 
                    whileHover={{ y: -5 }}
                    href="https://linkedin.com/in/dominic-musyoki6809" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'bg-gray-700 text-blue-400 hover:bg-blue-800' : 'bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white'} p-3 rounded-full transition-colors duration-300`}
                  >
                    <FaLinkedin className="text-xl" />
                  </motion.a>
                  <motion.a 
                    whileHover={{ y: -5 }}
                    href="https://github.com/dominic6809" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white'} p-3 rounded-full transition-colors duration-300`}
                  >
                    <FaGithub className="text-xl" />
                  </motion.a>
                  <motion.a 
                    whileHover={{ y: -5 }}
                    href="https://twitter.com/MusyokiDominic9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'bg-gray-700 text-blue-400 hover:bg-blue-600' : 'bg-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white'} p-3 rounded-full transition-colors duration-300`}
                  >
                    <FaTwitter className="text-xl" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-2/3"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-lg p-8 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Send Me a Message
              </h2>
              
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="from_name" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="from_name"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none text-base ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-200'
                      } ${
                        errors.from_name 
                          ? theme === 'dark' ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-200' 
                          : ''
                      }`}
                      placeholder="Your name"
                    />
                    {errors.from_name && <p className="text-red-500 text-sm mt-1">{errors.from_name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="from_email" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="from_email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none text-base ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-200'
                      } ${
                        errors.from_email 
                          ? theme === 'dark' ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-200' 
                          : ''
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.from_email && <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="from_subject" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="from_subject"
                    name="from_subject"
                    value={formData.from_subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-200'
                    } ${
                      errors.from_subject 
                        ? theme === 'dark' ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-200' 
                        : ''
                    }`}
                    placeholder="What's this about?"
                  />
                  {errors.from_subject && <p className="text-red-500 text-sm mt-1">{errors.from_subject}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-200'
                    } ${
                      errors.message 
                        ? theme === 'dark' ? 'border-red-500 focus:ring-red-500' : 'border-red-500 focus:ring-red-200' 
                        : ''
                    }`}
                    placeholder="Your message here..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg text-white font-medium transition-all text-base ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-8 w-11/12 max-w-md`}
          >
            <div className="text-center">
              <div className={`mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-6 ${
                modalContent.type === 'success'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {modalContent.type === 'success' ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {modalContent.title}
              </h3>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {modalContent.message}
              </p>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className={`px-6 py-2 rounded-lg font-medium ${
                  modalContent.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;