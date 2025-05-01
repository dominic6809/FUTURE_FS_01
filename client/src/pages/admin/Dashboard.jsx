// client/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  FolderIcon, 
  EnvelopeIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    messages: 0,
    newMessages: 0,
    newProjects: 0,
    newBlogPosts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/stats', {
          headers: getAuthHeader()
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Set up interval to refresh stats periodically (every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [getAuthHeader]);

  const cards = [
    { 
      name: 'Projects', 
      count: stats.projects, 
      newCount: stats.newProjects,
      icon: FolderIcon, 
      color: 'bg-blue-500', 
      href: '/admin/projects',
      description: 'Total portfolio projects'
    },
    { 
      name: 'Blog Posts', 
      count: stats.blogPosts, 
      newCount: stats.newBlogPosts,
      icon: DocumentTextIcon, 
      color: 'bg-green-500', 
      href: '/admin/blogs',
      description: 'Published blog entries'
    },
    { 
      name: 'Messages', 
      count: stats.messages, 
      newCount: stats.newMessages,
      icon: EnvelopeIcon, 
      color: 'bg-purple-500', 
      href: '/admin/contacts',
      description: 'Contact form submissions'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div 
                key={card.name}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${card.color} transition-all duration-300 hover:scale-105`}>
                      <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate flex items-center">
                          {card.name}
                          {card.newCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              +{card.newCount} new
                            </span>
                          )}
                        </dt>
                        <dd>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {card.count}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {card.description}
                          </p>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link
                      to={card.href}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center"
                    >
                      View all
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity and Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Activity
                </h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.recentActivity.map((activity, index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 rounded-full p-2 ${
                            activity.type === 'project' ? 'bg-blue-100 text-blue-500' :
                            activity.type === 'blog' ? 'bg-green-100 text-green-500' :
                            'bg-purple-100 text-purple-500'
                          } dark:bg-gray-700`}>
                            {activity.type === 'project' && <FolderIcon className="h-4 w-4" />}
                            {activity.type === 'blog' && <DocumentTextIcon className="h-4 w-4" />}
                            {activity.type === 'message' && <EnvelopeIcon className="h-4 w-4" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">{activity.title}</span>
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {activity.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                <Link
                  to="/admin/projects/"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FolderIcon className="mr-2 h-5 w-5" />
                  Add New Project
                </Link>
                <Link
                  to="/admin/blogs/"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <DocumentTextIcon className="mr-2 h-5 w-5" />
                  Write New Blog Post
                </Link>
                <Link
                  to="/admin/contacts"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <EnvelopeIcon className="mr-2 h-5 w-5" />
                  Check Messages
                  {stats.newMessages > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {stats.newMessages}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;