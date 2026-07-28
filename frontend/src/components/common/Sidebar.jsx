// ============================================================
// components/common/Sidebar.jsx
// Left sidebar for both applicant and admin layouts
// Collapsible on mobile via isOpen/onClose props
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdAssignment, MdAddCircle, MdPerson, MdSettings,
  MdPeople, MdBarChart, MdLogout, MdClose, MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getFileUrl, getInitials } from '../../utils/helpers';

const APPLICANT_LINKS = [
  { to: '/dashboard',        label: 'Dashboard',       icon: MdDashboard },
  { to: '/my-applications',  label: 'My Applications', icon: MdAssignment },
  { to: '/apply',            label: 'Apply Now',       icon: MdAddCircle },
  { to: '/profile',          label: 'Profile',         icon: MdPerson },
  { to: '/settings',         label: 'Settings',        icon: MdSettings },
];

const ADMIN_LINKS = [
  { to: '/admin/dashboard',    label: 'Dashboard',    icon: MdDashboard },
  { to: '/admin/applications', label: 'Applications', icon: MdAssignment },
  { to: '/admin/users',        label: 'Users',        icon: MdPeople },
  { to: '/admin/reports',      label: 'Reports',      icon: MdBarChart },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const links = isAdmin ? ADMIN_LINKS : APPLICANT_LINKS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdDashboard className="text-white text-lg" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">InternHub</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          {user?.profilePicture ? (
            <img
              src={getFileUrl(user.profilePicture)}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center
              text-white font-bold text-sm flex-shrink-0">
              {getInitials(user?.fullName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-3 flex-shrink-0 space-y-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {isDark
              ? <><MdLightMode className="text-lg" /> Light Mode</>
              : <><MdDarkMode className="text-lg" /> Dark Mode</>
            }
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
