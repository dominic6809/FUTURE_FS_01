// client/src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../navigation/AdminHeader';
import AdminSidebar from '../navigation/AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const location = useLocation();

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/admin') {
      setPageTitle('Dashboard');
    } else if (path.includes('/admin/projects')) {
      setPageTitle('Projects');
    } else if (path.includes('/admin/blogs')) {
      setPageTitle('Blog Posts');
    } else if (path.includes('/admin/contacts')) {
      setPageTitle('Messages');
    } else if (path.includes('/admin/settings')) {
      setPageTitle('Settings');
    }
    
    // Close sidebar on route change on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar component */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <AdminHeader 
          setSidebarOpen={setSidebarOpen} 
          pageTitle={pageTitle}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Dominic Muuo
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Admin Panel v1.0
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;