// ============================================================
// components/common/Footer.jsx
// Simple footer for public pages
// ============================================================

import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdDashboard className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">InternHub</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/"       className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/about"  className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/login"  className="hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Register</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {year} InternHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
