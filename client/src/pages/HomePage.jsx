import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { API_BASE_URL, getImageUrl, IMAGE_PLACEHOLDER } from '../utils/config';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Skills with descriptions organized by category
  const skillCategories = [
    {
      name: "Frontend",
      skills: [
        { name: 'React', description: 'Building interactive UIs with reusable components' },
        { name: 'JavaScript', description: 'Implementing dynamic functionality across applications' },
        { name: 'TypeScript', description: 'Writing type-safe code for robust applications' },
        { name: 'TailwindCSS', description: 'Crafting responsive designs with utility-first approach' }
      ]
    },
    {
      name: "Backend",
      skills: [
        { name: 'Node.js', description: 'Creating scalable server-side applications' },
        { name: 'Express', description: 'Building APIs and web applications efficiently' },
        { name: 'Python', description: 'Developing data-driven applications and scripts' },
        { name: 'GraphQL', description: 'Creating efficient and flexible APIs' }
      ]
    },
    {
      name: "Database",
      skills: [
        { name: 'MongoDB', description: 'Designing flexible NoSQL database solutions' },
        { name: 'MySQL', description: 'Structuring relational databases for data integrity' },
        { name: 'PostgreSQL', description: 'Managing complex data with advanced SQL features' },
        { name: 'Redis', description: 'Implementing high-performance caching solutions' }
      ]
    },
    {
      name: "Design",
      skills: [
        { name: 'UI/UX Design', description: 'Creating intuitive and engaging user experiences' },
        { name: 'Figma', description: 'Prototyping and designing modern interfaces' },
        { name: 'Responsive Design', description: 'Building layouts that work across all devices' },
        { name: 'Accessibility', description: 'Ensuring applications are usable by everyone' }
      ]
    }
  ];
  
  const [activeSkillCategory, setActiveSkillCategory] = useState("Frontend");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch projects and blogs in parallel
        const [projectsResponse, blogsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/projects`),
          fetch(`${API_BASE_URL}/api/blogs`)
        ]);

        // Check if responses are ok
        if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
        if (!blogsResponse.ok) throw new Error('Failed to fetch blogs');
        
        // Parse JSON responses
        const projectsData = await projectsResponse.json();
        const blogsData = await blogsResponse.json();
        
        setProjects(projectsData);
        setBlogs(blogsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="py-16 md:py-28 relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500 dark:bg-blue-600 opacity-5"
              initial={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              animate={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Mobile profile image - shows only on small screens */}
          <motion.div
            className="md:hidden flex justify-center mb-8" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <motion.div 
                className="absolute -z-10 w-56 h-56 rounded-full bg-blue-200 dark:bg-blue-900 opacity-30"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                style={{ top: '-10%', left: '-10%' }}
              />
              
              <motion.div 
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="/assets/images/profile.png" 
                  alt="John Doe" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = IMAGE_PLACEHOLDER;
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-12 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                variants={fadeInUp}
              >
                <span className="block">Hello, I'm</span>
                <span className="block text-blue-600 dark:text-blue-400">Dominic Muuo</span>
              </motion.h1>
              
              <motion.div 
                className="text-xl md:text-2xl font-medium mb-8 text-gray-600 dark:text-gray-300 h-16"
                variants={fadeInUp}
              >
                {/* <span className="mr-2">I'm a</span> */}
                <TypeAnimation
                  sequence={[
                    'Full Stack Developer',
                    1000,
                    'Software Engineer',
                    1000,
                    'UI/UX Designer',
                    1000,
                    'Problem Solver',
                    1000,
                    'Tech Enthusiast',
                    1000,
                    'DevOps Engineer',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-blue-600 dark:text-blue-400"
                />
              </motion.div>
              
              <motion.p 
                className="text-lg mb-10 text-gray-700 dark:text-gray-300 max-w-lg -mt-12"
                variants={fadeInUp}
              >
                I create modern web applications with cutting-edge technology and intuitive design that helps businesses grow and users stay engaged.
              </motion.p>
              
              <motion.div 
                className="flex space-x-4"
                variants={fadeInUp}
              >
                <Link 
                  to="/projects" 
                  className="group flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  View Projects
                  <HiArrowNarrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/contact" 
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Desktop profile image - hidden on small screens */}
            <motion.div 
              className="hidden md:flex md:w-1/2 justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -z-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-200 dark:bg-blue-900 opacity-30"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  style={{ top: '-10%', left: '-10%' }}
                />
                
                <motion.div 
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img 
                    src="/assets/images/profile.png" 
                    alt="John Doe" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMAGE_PLACEHOLDER;
                    }}
                  />
                </motion.div>
                
                {/* Tech bubble decorations */}
                {['Next', 'Django', 'Node'].map((tech, i) => (
                  <motion.div
                    key={tech}
                    className="absolute bg-white dark:bg-gray-800 rounded-full shadow-md px-3 py-1 text-sm text-blue-600 dark:text-blue-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.2) }}
                    style={{
                      top: `${30 + (i * 25)}%`,
                      right: `${-10 - (i * 5)}%`,
                    }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section with Animations and Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl -mt-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Skills
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Technologies and skills I've mastered through years of practice and passion for web development
          </motion.p>
          
          {/* Category Selector */}
          <motion.div 
            className="flex flex-wrap justify-center mb-10 gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {skillCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveSkillCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSkillCategory === category.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
          
          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories
              .find(category => category.name === activeSkillCategory)
              ?.skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-400 group h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl -mt-8">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Projects
            </h2>
          </motion.div>
          
          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A selection of my recent work showcasing my skills and problem-solving approach
          </motion.p>
          
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              to="/projects" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center group font-medium"
            >
              View All Projects
              <HiArrowNarrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          
          {isLoading ? (
            <ProjectsSkeletonLoader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <ProjectsList projects={projects.slice(0, 3)} />
          )}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl -mt-8">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest Insights
            </h2>
          </motion.div>
          
          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Thoughts and ideas on development, design, and technology trends
          </motion.p>
          
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              to="/blog" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center group font-medium"
            >
              View All Articles
              <HiArrowNarrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          
          {isLoading ? (
            <BlogsSkeletonLoader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <BlogsList blogs={blogs.slice(0, 3)} />
          )}
        </div>
      </section>

      {/* Contact CTA with rounded border */}
      <ContactCTA />
    </div>
  );
};

// Component for displaying projects
const ProjectsList = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <p className="text-center text-gray-500">No projects available at the moment.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project._id || index} project={project} index={index} />
      ))}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        <img 
          src={getImageUrl(project.image)}
          alt={project.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = IMAGE_PLACEHOLDER;
          }}
        />
        {project.featured && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <Link 
            to={`/projects/${project._id}`}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
          >
            View Details
            <HiArrowNarrowRight className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
          <div className="flex space-x-2">
            {(project.technologies || []).slice(0, 2).map((tech, i) => (
              <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Blogs List Component
const BlogsList = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <p className="text-center text-gray-500">No blog posts available at the moment.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, index) => (
        <BlogCard key={blog._id || index} blog={blog} index={index} />
      ))}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, index }) => {
  return (
    <motion.div 
      className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border-b-4 border-transparent hover:border-blue-600 dark:hover:border-blue-400"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Blog cover image */}
      <div className="h-40 overflow-hidden">
        <img 
          src={getImageUrl(blog.coverImage)}
          alt={blog.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = IMAGE_PLACEHOLDER;
          }}
        />
      </div>
      <div className="p-6">
        <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        <Link 
          to={`/blog/${blog.slug}`}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
        >
          Read More
          <HiArrowNarrowRight className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};

// Projects Skeleton Loader
const ProjectsSkeletonLoader = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md h-96 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Blogs Skeleton Loader
const BlogsSkeletonLoader = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md h-64 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-600"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
        </div>
      </div>
    ))}
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-10">
    <p className="text-red-500 mb-4">{message}</p>
    <p className="text-gray-600 dark:text-gray-400">Please try again later or contact for support.</p>
  </div>
);

// Contact CTA Component
const ContactCTA = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 max-w-5xl">
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-10 rounded-xl shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Animated particle effect */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              initial={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                y: [Math.random() * 100, -20],
                opacity: [0.1, 0.3, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Let's Discuss Your Next Project
          </motion.h2>
          
          <motion.p
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Have an idea or need a developer for your team? I'm available for freelance work and interesting opportunities.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/contact" 
              className="inline-block bg-white text-blue-600 font-medium px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);


export default HomePage;