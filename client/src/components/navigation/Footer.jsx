// client/src/components/navigation/ModernFooter.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp, FaSkype, FaEnvelope, FaMapMarkerAlt, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Show button when page is scrolled
  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Animation variants
  const linkVariants = {
    hover: { x: 8, transition: { duration: 0.2 } },
    initial: { x: 0, transition: { duration: 0.2 } }
  };
  
  const socialIconVariants = {
    hover: { y: -5, scale: 1.2, transition: { duration: 0.2 } },
    initial: { y: 0, scale: 1, transition: { duration: 0.2 } }
  };

  // Navigation links
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  // Social media links
  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/dominic6809', label: 'GitHub', color: 'hover:text-gray-900' },
    { icon: FaLinkedin, url: 'https://linkedin.com/in/dominic-musyoki6809', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: FaTwitter, url: 'https://twitter.com/MusyokiDominic9', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaWhatsapp, url: 'https://wa.me/0742899959', label: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: FaSkype, url: 'skype:your.username?call', label: 'Skype', color: 'hover:text-blue-500' },
  ];
  
  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 pt-16 pb-8 overflow-hidden">
      {/* Wavy top border */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
        <svg className="w-full h-full text-white dark:text-gray-800 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo & About column */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Link to="/" className="flex items-center">
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dominic Muuo
                </span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Showcasing my skills, projects, and experience in web development and design. Building innovative solutions with modern technologies.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`text-gray-600 dark:text-gray-400 ${social.color} transition-colors`}
                    initial="initial"
                    whileHover="hover"
                    onMouseEnter={() => setHoveredIcon(index)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    <motion.div variants={socialIconVariants}>
                      <Icon className="h-6 w-6" />
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h3 className="text-lg font-bold mb-6 relative">
              <span className="inline-block pb-2 relative">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
              </span>
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <motion.li key={index} initial="initial" whileHover="hover">
                  <motion.div variants={linkVariants}>
                    <Link 
                      to={link.path} 
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                    >
                      <span className="mr-2 text-xs">›</span>
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-lg font-bold mb-6 relative">
              <span className="inline-block pb-2 relative">
                Contact
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
              </span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">muuomusyoki018@gmail.com</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Nairobi, Kenya</span>
              </li>
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} Dominic Muuo | All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 md:mt-0">
              Designed with <span className="text-red-500">♥</span> for the web
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="fixed right-8 bottom-8 p-3 rounded-full bg-blue-600 text-white z-50 shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default ModernFooter;