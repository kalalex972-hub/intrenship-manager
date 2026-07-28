// ============================================================
// pages/public/NotFound.jsx — 404 Page
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { MdHome, MdArrowBack } from 'react-icons/md';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        {/* 404 number */}
        <div className="text-9xl font-black text-blue-600/20 dark:text-blue-400/20 leading-none mb-4 select-none">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium
              text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200
              dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <MdArrowBack className="text-lg" /> Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium
              text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <MdHome className="text-lg" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
