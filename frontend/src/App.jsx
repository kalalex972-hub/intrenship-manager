// ============================================================
// App.jsx — Root Router Configuration
// Defines all routes with layout wrappers and auth guards.
// Three guard components: ProtectedRoute, AdminRoute, GuestRoute
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// ── Layouts ──────────────────────────────────────────────────
import PublicLayout    from './layouts/PublicLayout';
import ApplicantLayout from './layouts/ApplicantLayout';
import AdminLayout     from './layouts/AdminLayout';

// ── Public Pages ──────────────────────────────────────────────
import Home      from './pages/public/Home';
import About     from './pages/public/About';
import Login     from './pages/public/Login';
import Register  from './pages/public/Register';
import NotFound  from './pages/public/NotFound';

// ── Applicant Pages ───────────────────────────────────────────
import ApplicantDashboard from './pages/applicant/Dashboard';
import MyApplications     from './pages/applicant/MyApplications';
import Apply              from './pages/applicant/Apply';
import Profile            from './pages/applicant/Profile';
import Settings           from './pages/applicant/Settings';

// ── Admin Pages ───────────────────────────────────────────────
import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminApplications   from './pages/admin/AdminApplications';
import ApplicationDetails  from './pages/admin/ApplicationDetails';
import AdminUsers          from './pages/admin/AdminUsers';
import AdminReports        from './pages/admin/AdminReports';

// ============================================================
// Route Guards
// ============================================================

/**
 * ProtectedRoute — Requires valid authentication.
 * Redirects unauthenticated users to /login,
 * saving the intended path in location state.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

/**
 * AdminRoute — Requires admin role.
 * Redirects non-admins to their dashboard.
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

/**
 * GuestRoute — Redirects already-authenticated users away from
 * login/register pages to their appropriate dashboard.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen text="Loading..." />;
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

// ============================================================
// App Component
// ============================================================
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes (with Navbar + Footer) ──────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"       element={<Home />} />
          <Route path="/about"  element={<About />} />

          {/* Auth pages — redirect to dashboard if already logged in */}
          <Route path="/login"
            element={<GuestRoute><Login /></GuestRoute>}
          />
          <Route path="/register"
            element={<GuestRoute><Register /></GuestRoute>}
          />
        </Route>

        {/* ── Applicant Routes (with Sidebar layout) ────────── */}
        <Route
          element={
            <ProtectedRoute>
              <ApplicantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"        element={<ApplicantDashboard />} />
          <Route path="/my-applications"  element={<MyApplications />} />
          <Route path="/apply"            element={<Apply />} />
          <Route path="/profile"          element={<Profile />} />
          <Route path="/settings"         element={<Settings />} />
        </Route>

        {/* ── Admin Routes (with Admin Sidebar layout) ──────── */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin/dashboard"             element={<AdminDashboard />} />
          <Route path="/admin/applications"          element={<AdminApplications />} />
          <Route path="/admin/applications/:id"      element={<ApplicationDetails />} />
          <Route path="/admin/users"                 element={<AdminUsers />} />
          <Route path="/admin/users/:id"             element={<ApplicationDetails />} />
          <Route path="/admin/reports"               element={<AdminReports />} />
        </Route>

        {/* ── Fallback: 404 ─────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
