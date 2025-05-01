// client/src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaLaptopCode, FaGraduationCap, FaBriefcase } from 'react-icons/fa';

const AboutPage = () => {
  // Sample education data
  const education = [
    {
      id: 1,
      degree: 'Bachelor of Computer Science',
      institution: 'Karatina University',
      duration: '2022 - now',
      description: 'Specialized in Web Technologies and User Experience Design. Participated in national Hackathon competitions.'
    },
    {
      id: 2,
      degree: 'Software Engineering Foundations with Backend specializations',
      institution: 'Alx Kenya',
      duration: '2023 - 2025',
      description: 'Focus on software development, database management, web Infrastructure, and Web Monitoring. Participated in project collaborations and Teamwork.'
    }
  ];

  // Sample experience data
  const experience = [
    {
      id: 1,
      position: 'Full Stack Developer Internship',
      company: 'Future Interns',
      duration: '2025 - now',
      description: 'Leading a team of developers to build scalable web applications. Implemented CI/CD pipelines and improved code quality standards.'
    },
    {
      id: 2,
      position: 'UI/UX Designer & Frontend Developer',
      company: 'Creative Solutions Agency',
      duration: '2024 - 2025',
      description: 'Designed and developed user interfaces for various clients across different industries. Improved user engagement by 40% through A/B testing and data-driven design decisions.'
    },
    {
      id: 3,
      position: 'Web Developer Intern',
      company: 'StartUp Hub',
      duration: '2023 - 2024',
      description: 'Assisted in developing responsive websites and web applications. Gained hands-on experience with modern JavaScript frameworks and version control systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 -mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About Me</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Get to know more about my background, experience, and what drives me as a developer and designer.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <img 
                  src="/assets/images/profile.png" 
                  alt="Dominic Muuo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Profile';
                  }}
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">John Doe</h2>
              <h3 className="text-xl text-blue-600 dark:text-blue-400 mb-4">Full Stack Developer & UI/UX Designer</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                I'm a passionate developer with over 2 years of experience building web applications and designing user interfaces. 
                I specialize in creating clean, responsive, and intuitive web experiences using modern technologies and best practices.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                My journey in tech began during University when I built my first e-commerce website for a local business. 
                Since then, I've worked with startups, agencies, and enterprise companies to deliver high-quality digital solutions 
                that solve real-world problems and delight users.
              </p>
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Core Technical Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'JavaScript', 'TypeScript', 'TailwindCSS', 'MongoDB', 'MySQL', 'Next.js',
                    'Git', 'Responsive Design', 'RESTful APIs', 'GraphQL', 'Django', 'Laravel', 'AWS'].map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <a 
                href="/resume.pdf" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                download
              >
                <FaDownload className="mr-2" />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">What I Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaLaptopCode size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Web Development</h3>
              <p className="text-gray-700 dark:text-gray-300">
                I build modern, responsive websites and web applications using the latest technologies and best practices to ensure optimal performance and user experience.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">UI/UX Design</h3>
              <p className="text-gray-700 dark:text-gray-300">
                I create intuitive and visually appealing user interfaces with a focus on user experience, accessibility, and modern design principles.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Performance Optimization</h3>
              <p className="text-gray-700 dark:text-gray-300">
                I optimize website and application performance to ensure fast loading times, smooth interactions, and an overall enjoyable user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Experience */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <div className="flex items-center mb-8">
                <FaGraduationCap className="text-blue-600 dark:text-blue-400 text-3xl mr-4" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
              </div>
              <div className="space-y-8">
                {education.map(item => (
                  <div key={item.id} className="border-l-4 border-blue-600 pl-4 py-1">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">{item.duration}</div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{item.degree}</h3>
                    <div className="text-gray-600 dark:text-gray-300 mb-2">{item.institution}</div>
                    <p className="text-gray-700 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center mb-8">
                <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl mr-4" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Experience</h2>
              </div>
              <div className="space-y-8">
                {experience.map(item => (
                  <div key={item.id} className="border-l-4 border-blue-600 pl-4 py-1">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">{item.duration}</div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{item.position}</h3>
                    <div className="text-gray-600 dark:text-gray-300 mb-2">{item.company}</div>
                    <p className="text-gray-700 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-blue-600 text-white relative overflow-hidden rounded-3xl my-8 mx-auto max-w-5xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in Working Together?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Feel free to reach out if you're looking for a developer for your project or if you have any questions.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;