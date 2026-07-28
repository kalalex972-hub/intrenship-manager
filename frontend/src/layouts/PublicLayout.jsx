// ============================================================
// layouts/PublicLayout.jsx
// Wraps public pages: Navbar on top, Footer at bottom
// Used for: Home, About, Login, Register
// ============================================================

import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/common/Toast';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top navigation */}
      <Navbar />

      {/* Page content — grows to fill available height */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global toast notifications */}
      <Toast />
    </div>
  );
};

export default PublicLayout;
