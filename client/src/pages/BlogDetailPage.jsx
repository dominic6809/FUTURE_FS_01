// client/src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaTags,
  FaArrowLeft, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaPinterest,
  FaEnvelope,
  FaLink,
  FaArrowRight,
  FaArrowUp,
} from 'react-icons/fa';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL;

const BlogDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moreBlogs, setMoreBlogs] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  
  // Check if we have pre-loaded blog data passed via location state
  useEffect(() => {
    if (location.state && location.state.blogData) {
      setBlog(location.state.blogData);
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        
        // First try the API endpoint
        let response;
        try {
          response = await axios.get(`/api/blogs/slug/${slug}`);
          setBlog(response.data);
          
          // Fetch all blogs to find more posts and prev/next posts
          const allBlogsResponse = await axios.get('/api/blogs');
          const allBlogs = allBlogsResponse.data;
          
          // Set up more blogs (excluding current)
          const otherBlogs = allBlogs.filter(b => b.slug !== slug);
          setMoreBlogs(otherBlogs.slice(0, 3));
          
          // Set up previous and next blogs
          const currentIndex = allBlogs.findIndex(b => b.slug === slug);
          if (currentIndex > 0) {
            setPrevBlog(allBlogs[currentIndex - 1]);
          }
          
          if (currentIndex < allBlogs.length - 1) {
            setNextBlog(allBlogs[currentIndex + 1]);
          }
          
        } catch (apiErr) {
          console.warn('API endpoint not responding, attempting to fetch from all blogs');
          
          // If API endpoint fails, try getting this specific blog from the all blogs endpoint
          const allBlogsResponse = await axios.get('/api/blogs');
          const allBlogs = allBlogsResponse.data;
          const blogPost = allBlogs.find(blog => blog.slug === slug);
          
          if (blogPost) {
            setBlog(blogPost);
            
            // Set up more blogs (excluding current)
            const otherBlogs = allBlogs.filter(b => b.slug !== slug);
            setMoreBlogs(otherBlogs.slice(0, 3));
            
            // Set up previous and next blogs
            const currentIndex = allBlogs.findIndex(b => b.slug === slug);
            if (currentIndex > 0) {
              setPrevBlog(allBlogs[currentIndex - 1]);
            }
            
            if (currentIndex < allBlogs.length - 1) {
              setNextBlog(allBlogs[currentIndex + 1]);
            }
          } else {
            throw new Error('Blog post not found');
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
    // Scroll to top when blog post changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-2xl mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl text-red-500 dark:text-red-400 mb-4 font-bold">Error</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{error || 'Blog post not found'}</p>
          <Link 
            to="/blog" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
          >
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Function to format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get estimated read time
  const getReadTime = () => {
    if (blog.readTime) return blog.readTime;
    
    // Calculate if not provided
    const wordsPerMinute = 200;
    const text = blog.content.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const wordCount = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1; // Minimum 1 minute
  };

  // Get full image URL matching the admin component logic
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'}${imagePath}`;
  };

  // Copy article link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Sanitize HTML content from TinyMCE
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back to blog button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 font-medium transition duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to All Articles
        </Link>
        
        {/* Blog Header */}
        <header className="mb-10">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition cursor-pointer"
                  onClick={() => navigate('/blog', { state: { initialTag: tag } })}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">{blog.title}</h1>
          
          {/* Blog metadata */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{formatDate(blog.createdAt || blog.date)}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{getReadTime()} min read</span>
            </div>
          </div>
        </header>
        
        {/* Featured Image */}
        {blog.coverImage && (
          <figure className="mb-9 max-w-xl">
            <div className="rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-800">
              <img 
                src={getImageUrl(blog.coverImage)} 
                alt={blog.title} 
                className="w-full object-cover max-h-[500px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg'; // Fallback image
                }}
              />
            </div>
            {blog.imageCaption && (
              <figcaption className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">{blog.imageCaption}</figcaption>
            )}
          </figure>
        )}
        
        {/* Blog Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12 overflow-hidden blog-content">
          {/* Custom styles for TinyMCE content */}
          <style jsx>{`
            .blog-content {
              color: var(--text-primary);
            }
            
            .blog-content h1,
            .blog-content h2,
            .blog-content h3,
            .blog-content h4 {
              font-weight: 700;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              color: var(--heading-color);
            }
            
            .blog-content h1 {
              font-size: 2.25rem;
              border-bottom: 1px solid var(--border-color);
              padding-bottom: 0.3em;
            }
            
            .blog-content h2 {
              font-size: 1.75rem;
              border-bottom: 1px solid var(--border-color);
              padding-bottom: 0.3em;
            }
            
            .blog-content h3 {
              font-size: 1.5rem;
            }
            
            .blog-content h4 {
              font-size: 1.25rem;
            }
            
            .blog-content p {
              margin-bottom: 1.5em;
              line-height: 1.7;
            }
            
            .blog-content a {
              color: var(--link-color);
              text-decoration: underline;
              text-decoration-thickness: 1px;
              text-underline-offset: 2px;
              transition: color 0.2s;
            }
            
            .blog-content a:hover {
              color: var(--link-hover-color);
            }
            
            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1.5rem 0;
            }
            
            .blog-content ul, 
            .blog-content ol {
              margin-bottom: 1.5em;
              padding-left: 1.5em;
            }
            
            .blog-content li {
              margin-bottom: 0.5em;
            }
            
            .blog-content blockquote {
              border-left: 4px solid var(--blockquote-border);
              padding-left: 1rem;
              margin-left: 0;
              color: var(--blockquote-text);
              font-style: italic;
              background-color: var(--blockquote-bg);
              padding: 1rem;
              border-radius: 0 0.5rem 0.5rem 0;
            }
            
            .blog-content pre {
              background-color: var(--code-bg);
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1.5rem 0;
            }
            
            .blog-content code {
              background-color: var(--inline-code-bg);
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.9em;
            }
            
            .blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5rem 0;
            }
            
            .blog-content th,
            .blog-content td {
              padding: 0.75rem;
              border: 1px solid var(--border-color);
            }
            
            .blog-content th {
              background-color: var(--table-header-bg);
              font-weight: 600;
            }
            
            /* Light/dark theme variables */
            :root {
              --text-primary: #374151;
              --heading-color: #1F2937;
              --link-color: #2563EB;
              --link-hover-color: #1D4ED8;
              --border-color: rgba(229, 231, 235, 1);
              --blockquote-border: #3B82F6;
              --blockquote-bg: rgba(239, 246, 255, 0.6);
              --blockquote-text: #4B5563;
              --code-bg: #F3F4F6;
              --inline-code-bg: rgba(229, 231, 235, 0.5);
              --table-header-bg: #F9FAFB;
            }
            
            .dark {
              --text-primary: #E5E7EB;
              --heading-color: #F9FAFB;
              --link-color: #60A5FA;
              --link-hover-color: #93C5FD;
              --border-color: rgba(75, 85, 99, 0.4);
              --blockquote-border: #3B82F6;
              --blockquote-bg: rgba(30, 58, 138, 0.15);
              --blockquote-text: #9CA3AF;
              --code-bg: rgba(31, 41, 55, 0.8);
              --inline-code-bg: rgba(55, 65, 81, 0.5);
              --table-header-bg: rgba(31, 41, 55, 0.6);
            }
          `}</style>
          
          {/* Render TinyMCE content */}
          <div className="blog-content" dangerouslySetInnerHTML={createMarkup(blog.content)} />
        </article>

        {/* Share Article */}
        <div className="my-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Share this article</h3>
          <div className="flex flex-wrap gap-2">
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Share on Twitter"
            >
              <FaTwitter />
              <span className="hidden sm:inline">Twitter</span>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#4267B2] hover:bg-[#375695] text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Share on Facebook"
            >
              <FaFacebook />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006399] text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedin />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a 
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(blog.coverImage ? getImageUrl(blog.coverImage) : '')}&description=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#E60023] hover:bg-[#D00020] text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Share on Pinterest"
            >
              <FaPinterest />
              <span className="hidden sm:inline">Pinterest</span>
            </a>
            <a 
              href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(`Check out this article: ${window.location.href}`)}`}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Share via Email"
            >
              <FaEnvelope />
              <span className="hidden sm:inline">Email</span>
            </a>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition shadow-sm"
              aria-label="Copy article link"
            >
              <FaLink />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="my-12 relative overflow-hidden rounded-2xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 dark:opacity-80"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative p-8 text-center text-white z-10">
            <h3 className="text-2xl font-bold mb-2">Enjoyed this article?</h3>
            <p className="text-blue-100 mb-6">Subscribe to receive the latest articles and updates directly in your inbox.</p>
            
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 shadow-inner" 
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition shadow"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        
        {/* Next and Previous Posts Navigation */}
        <nav className="my-10 pt-6 border-t border-gray-200 dark:border-gray-700" aria-label="Blog navigation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Post */}
            {prevBlog ? (
              <Link 
                to={`/blog/${prevBlog.slug}`} 
                state={{ blogData: prevBlog }}
                className="group"
              >
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition h-full">
                  <div className="flex items-center mb-2 text-blue-600 dark:text-blue-400">
                    <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Previous Article</span>
                  </div>
                  <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
                    {prevBlog.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block"></div>
            )}
            
            {/* Next Post */}
            {nextBlog ? (
              <Link 
                to={`/blog/${nextBlog.slug}`} 
                state={{ blogData: nextBlog }}
                className="group"
              >
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-right h-full">
                  <div className="flex items-center justify-end mb-2 text-blue-600 dark:text-blue-400">
                    <span className="text-sm">Next Article</span>
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
                    {nextBlog.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block"></div>
            )}
          </div>
        </nav>
        
        {/* More Blogs Section */}
        {moreBlogs.length > 0 && (
          <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreBlogs.map((post) => (
                <div 
                  key={post._id || post.slug} 
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
                >
                  {post.coverImage && (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src={getImageUrl(post.coverImage)} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg'; 
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatDate(post.createdAt || post.date)}</div>
                    <h4 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-800 dark:text-white">
                      <Link to={`/blog/${post.slug}`} state={{ blogData: post }}>{post.title}</Link>
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm flex-grow">{post.excerpt}</p>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      state={{ blogData: post }} 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center text-sm group mt-auto"
                    >
                      Read More
                      <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;