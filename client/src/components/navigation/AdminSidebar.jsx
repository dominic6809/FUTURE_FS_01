// client/src/components/navigation/AdminSidebar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon, 
  FolderIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { getAuthHeader, user } = useAuth();
  const [counts, setCounts] = useState({
    newProjects: 0,
    newBlogPosts: 0,
    newMessages: 0
  });

  useEffect(() => {
    const fetchNotificationCounts = async () => {
      // try {
      //   const response = await axios.get('/api/admin/notifications', {
      //     headers: getAuthHeader()
      //   });
      //   setCounts(response.data);
      // } catch (error) {
      //   console.error('Error fetching notification counts:', error);
      // }
    };

    fetchNotificationCounts();
    
    // Set up interval to refresh counts every 2 minutes
    const intervalId = setInterval(fetchNotificationCounts, 2 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [getAuthHeader]);

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/admin', count: null },
    { name: 'Projects', icon: FolderIcon, href: '/admin/projects', count: counts.newProjects },
    { name: 'Blog Posts', icon: DocumentTextIcon, href: '/admin/blogs', count: counts.newBlogPosts },
    { name: 'Messages', icon: ChatBubbleLeftRightIcon, href: '/admin/contacts', count: counts.newMessages },
    { name: 'Settings', icon: AdjustmentsHorizontalIcon, href: '/admin/settings', count: null },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? 'visible' : 'invisible'
        }`}
        aria-hidden="true"
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar panel */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition-transform ${
            sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'
          }`}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</span>
            </div>
            
            {/* User profile section */}
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation links */}
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`
                  }
                >
                  <item.icon
                    className="mr-4 h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.count > 0 && (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ml-2 px-2 py-0.5 rounded-full text-xs font-medium">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          
          {/* Footer links */}
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <NavLink to="/" className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
              Back to Website
            </NavLink>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow-inner border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</span>
            </div>
            
            {/* User profile section */}
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation links */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200`
                    }
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.count > 0 && (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ml-2 px-2 py-0.5 rounded-full text-xs font-medium">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            {/* Footer links */}
            <div className="flex-shrink-0 flex flex-col border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <NavLink to="/" className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm">
                <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                Back to Website
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;