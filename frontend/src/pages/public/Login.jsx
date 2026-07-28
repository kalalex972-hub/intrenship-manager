// ============================================================
// pages/public/Login.jsx — Login Page
// React Hook Form, validation, redirects by role after login
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin, MdDashboard } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from || (isAdmin ? '/admin/dashboard' : '/dashboard');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    const result = await login(data);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.fullName.split(' ')[0]}!`);
      const dest = result.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(dest, { replace: true });
    } else {
      toast.error(result.message || 'Login failed. Please try again.');
      // Set field-level error for wrong credentials
      setError('password', { message: result.message });
    }
  };

  if (authLoading) return <LoadingSpinner fullScreen text="Checking session..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MdDashboard className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to your InternHub account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className={labelCls} htmlFor="email">Email address</label>
              <div className="relative">
                <MdEmail className={iconCls} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputCls(!!errors.email)}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls} htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <MdLock className={iconCls} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`${inputCls(!!errors.password)} pr-12`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
              {errors.password && <p className={errorCls}>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600
                hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting
                ? <><LoadingSpinner size="sm" color="white" /> Signing in...</>
                : <><MdLogin className="text-xl" /> Sign In</>
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {/* Demo credentials hint */}
          {isAdmin && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">Demo Admin Credentials:</p>
              <p className="text-xs text-blue-600 dark:text-blue-300">Email: admin@internship.com</p>
              <p className="text-xs text-blue-600 dark:text-blue-300">Password: Admin@123456</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared style helpers
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const iconCls  = 'absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400';
const errorCls = 'mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1';

const inputCls = (hasError) =>
  `w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors
   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
   placeholder-gray-400 dark:placeholder-gray-500
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   ${hasError
     ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
     : 'border-gray-200 dark:border-gray-700'
   }`;

export default Login;
