// ============================================================
// components/common/Navbar.jsx
// Top navigation bar — public pages & authenticated header
// ============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenu, MdClose, MdDashboard, MdLogout, MdPerson, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getFileUrl, getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/',       label: 'Home' },
    { path: '/about',  label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
      border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdDashboard className="text-white text-lg" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              InternHub
            </span>
          </Link>

          {/* Desktop nav links (public) */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg
                text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>

            {isAuthenticated ? (
              /* User dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Avatar */}
                  {user?.profilePicture ? (
                    <img
                      src={getFileUrl(user.profilePicture)}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center
                      text-white text-xs font-bold">
                      {getInitials(user?.fullName)}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800
                      rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20
                      animate-slide-down overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30
                          text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium capitalize">
                          {user?.role}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                          onClick={() => setDropdownOpen(false)}
                          className={dropdownItemCls}
                        >
                          <MdDashboard className="text-lg" /> Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className={dropdownItemCls}
                        >
                          <MdPerson className="text-lg" /> Profile
                        </Link>
                        <hr className="my-1 border-gray-100 dark:border-gray-700" />
                        <button onClick={handleLogout} className={`${dropdownItemCls} w-full text-red-500 dark:text-red-400`}>
                          <MdLogout className="text-lg" /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                    hover:text-gray-900 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                    hover:bg-blue-700 transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {!isAuthenticated && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                  text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {menuOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && !isAuthenticated && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-1 animate-slide-down">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              {label}
            </Link>
          ))}
          <hr className="border-gray-100 dark:border-gray-700 my-2" />
          <Link to="/login" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Login
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700 text-center">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

const dropdownItemCls = `flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300
  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`;

export default Navbar;
