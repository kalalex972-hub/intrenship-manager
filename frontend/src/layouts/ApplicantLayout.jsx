// ============================================================
// layouts/ApplicantLayout.jsx
// Shell for all authenticated applicant pages.
// Left sidebar (collapsible on mobile) + top header + content area.
// ============================================================

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MdMenu, MdNotifications } from 'react-icons/md';
import Sidebar from '../components/common/Sidebar';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getFileUrl, getInitials } from '../utils/helpers';

// Map pathnames to human-readable page titles
const PAGE_TITLES = {
  '/dashboard':       'Dashboard',
  '/my-applications': 'My Applications',
  '/apply':           'Apply for Internship',
  '/profile':         'My Profile',
  '/settings':        'Settings',
};

const ApplicantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'InternHub';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="flex-shrink-0 h-16 bg-white dark:bg-gray-900
          border-b border-gray-200 dark:border-gray-700
          flex items-center justify-between px-4 sm:px-6 gap-4">

          {/* Left: hamburger + page title */}
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
              {pageTitle}
            </h1>
          </div>

          {/* Right: notification bell + avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg
                text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors relative"
              aria-label="Notifications"
            >
              <MdNotifications className="text-xl" />
            </button>

            {/* User avatar */}
            {user?.profilePicture ? (
              <img
                src={getFileUrl(user.profilePicture)}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center
                text-white text-xs font-bold">
                {getInitials(user?.fullName)}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast notifications */}
      <Toast />
    </div>
  );
};

export default ApplicantLayout;
