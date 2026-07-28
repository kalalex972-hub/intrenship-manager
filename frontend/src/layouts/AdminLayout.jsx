// ============================================================
// layouts/AdminLayout.jsx
// Shell for all admin pages.
// Sidebar + top header with admin badge + scrollable content.
// ============================================================

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MdMenu, MdAdminPanelSettings } from 'react-icons/md';
import Sidebar from '../components/common/Sidebar';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getFileUrl, getInitials } from '../utils/helpers';

const ADMIN_PAGE_TITLES = {
  '/admin/dashboard':              'Admin Dashboard',
  '/admin/applications':           'All Applications',
  '/admin/users':                  'Manage Users',
  '/admin/reports':                'Reports & Analytics',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Handle dynamic routes like /admin/applications/:id
  const getTitle = () => {
    if (ADMIN_PAGE_TITLES[location.pathname]) {
      return ADMIN_PAGE_TITLES[location.pathname];
    }
    if (location.pathname.startsWith('/admin/applications/')) {
      return 'Application Details';
    }
    if (location.pathname.startsWith('/admin/users/')) {
      return 'Applicant Profile';
    }
    return 'Admin Panel';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="flex-shrink-0 h-16 bg-white dark:bg-gray-900
          border-b border-gray-200 dark:border-gray-700
          flex items-center justify-between px-4 sm:px-6 gap-4">

          {/* Left: hamburger + title + admin badge */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
                text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open sidebar"
            >
              <MdMenu className="text-xl" />
            </button>

            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {getTitle()}
            </h1>

            {/* Admin badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              text-xs font-medium bg-purple-100 dark:bg-purple-900/30
              text-purple-700 dark:text-purple-400">
              <MdAdminPanelSettings className="text-sm" />
              Admin
            </span>
          </div>

          {/* Right: avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                Administrator
              </p>
            </div>

            {user?.profilePicture ? (
              <img
                src={getFileUrl(user.profilePicture)}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center
                text-white text-xs font-bold">
                {getInitials(user?.fullName)}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast notifications */}
      <Toast />
    </div>
  );
};

export default AdminLayout;
