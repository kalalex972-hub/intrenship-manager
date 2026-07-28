// ============================================================
// pages/public/Register.jsx — Registration Page
// Full validation, password strength indicator, auto-login after register
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  MdPerson, MdEmail, MdLock, MdPhone,
  MdVisibility, MdVisibilityOff, MdHowToReg, MdDashboard, MdBadge,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Password strength calculator
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd))    score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { label: '',          color: '' },
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak',      color: 'bg-orange-500' },
    { label: 'Fair',      color: 'bg-amber-500' },
    { label: 'Good',      color: 'bg-blue-500' },
    { label: 'Strong',    color: 'bg-emerald-500' },
  ];
  return { score, ...levels[score] };
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { username: '', fullName: '', email: '', password: '', confirmPassword: '', phone: '' },
  });

  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      // Register the user
      const regData = await authService.register(payload);

      // Auto-login after registration
      localStorage.setItem('token', regData.token);
      await login({ email: data.email, password: data.password });

      toast.success('Account created successfully! Welcome to InternHub.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);

      // Set field errors for duplicate email/username
      if (message.toLowerCase().includes('email')) {
        setError('email', { message });
      } else if (message.toLowerCase().includes('username')) {
        setError('username', { message });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MdDashboard className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Join InternHub and start applying for internships
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Full Name + Username row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className={lbl} htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <MdPerson className={ico} />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className={inp(!!errors.fullName)}
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'At least 2 characters' },
                      maxLength: { value: 100, message: 'Maximum 100 characters' },
                    })}
                  />
                </div>
                {errors.fullName && <p className={err}>{errors.fullName.message}</p>}
              </div>

              {/* Username */}
              <div>
                <label className={lbl} htmlFor="username">Username</label>
                <div className="relative">
                  <MdBadge className={ico} />
                  <input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    className={inp(!!errors.username)}
                    {...register('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'At least 3 characters' },
                      maxLength: { value: 30, message: 'Maximum 30 characters' },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Letters, numbers, and _ only',
                      },
                    })}
                  />
                </div>
                {errors.username && <p className={err}>{errors.username.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={lbl} htmlFor="email">Email address</label>
              <div className="relative">
                <MdEmail className={ico} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={inp(!!errors.email)}
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <p className={err}>{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={lbl} htmlFor="phone">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <MdPhone className={ico} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className={inp(!!errors.phone)}
                  {...register('phone', {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: 'Enter a valid phone number',
                    },
                  })}
                />
              </div>
              {errors.phone && <p className={err}>{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={lbl} htmlFor="password">Password</label>
              <div className="relative">
                <MdLock className={ico} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className={`${inp(!!errors.password)} pr-12`}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must contain uppercase, lowercase, and a number',
                    },
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
              {errors.password && <p className={err}>{errors.password.message}</p>}

              {/* Password strength bar */}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`flex-1 rounded-full transition-colors
                        ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      Strength: <span className="font-medium">{strength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={lbl} htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <MdLock className={ico} />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`${inp(!!errors.confirmPassword)} pr-12`}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordValue || 'Passwords do not match',
                  })}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showConfirm ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
              {errors.confirmPassword && <p className={err}>{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600
                hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isSubmitting
                ? <><LoadingSpinner size="sm" color="white" /> Creating account...</>
                : <><MdHowToReg className="text-xl" /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Style helpers
const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const ico = 'absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400';
const err = 'mt-1 text-xs text-red-600 dark:text-red-400';
const inp = (hasError) =>
  `w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors
   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
   placeholder-gray-400 dark:placeholder-gray-500
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   ${hasError ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`;

export default Register;
