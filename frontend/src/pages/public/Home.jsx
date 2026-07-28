// ============================================================
// pages/public/Home.jsx — Landing Page
// Hero section, features, stats, and CTA
// ============================================================

import { Link } from 'react-router-dom';
import {
  MdRocketLaunch, MdTrackChanges, MdSecurity, MdDashboard,
  MdAssignment, MdCheckCircle, MdArrowForward, MdPeople,
  MdBarChart, MdUploadFile,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  {
    icon: MdRocketLaunch,
    title: 'Easy Application',
    desc: 'Submit your internship application in minutes with our streamlined form.',
    color: 'blue',
  },
  {
    icon: MdTrackChanges,
    title: 'Real-Time Tracking',
    desc: 'Track your application status — Pending, Reviewed, Accepted, or Rejected.',
    color: 'emerald',
  },
  {
    icon: MdUploadFile,
    title: 'Resume Upload',
    desc: 'Upload your PDF resume directly with your application securely.',
    color: 'purple',
  },
  {
    icon: MdDashboard,
    title: 'Personal Dashboard',
    desc: 'View all your applications and their statuses in one clean dashboard.',
    color: 'amber',
  },
  {
    icon: MdBarChart,
    title: 'Analytics',
    desc: 'Admins get powerful analytics and charts for smarter hiring decisions.',
    color: 'red',
  },
  {
    icon: MdSecurity,
    title: 'Secure & Private',
    desc: 'JWT authentication and bcrypt password hashing keep your data safe.',
    color: 'teal',
  },
];

const STATS = [
  { value: '500+', label: 'Applications Processed' },
  { value: '15+',  label: 'Internship Positions' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Platform Availability' },
];

const colorMap = {
  blue:   { bg: 'bg-blue-100 dark:bg-blue-900/30',   icon: 'text-blue-600 dark:text-blue-400' },
  emerald:{ bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
  amber:  { bg: 'bg-amber-100 dark:bg-amber-900/30',  icon: 'text-amber-600 dark:text-amber-400' },
  red:    { bg: 'bg-red-100 dark:bg-red-900/30',      icon: 'text-red-600 dark:text-red-400' },
  teal:   { bg: 'bg-teal-100 dark:bg-teal-900/30',    icon: 'text-teal-600 dark:text-teal-400' },
};

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              <MdRocketLaunch className="text-base" />
              Launch Your Career Today
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Manage Your{' '}
              <span className="text-yellow-300">Internship</span>
              <br />Applications Effortlessly
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Apply for internships, track your application status in real time,
              and take the next step in your professional journey — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                    bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50
                    transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <MdDashboard className="text-xl" />
                  Go to Dashboard
                  <MdArrowForward className="text-lg" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                      bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50
                      transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <MdRocketLaunch className="text-xl" />
                    Get Started Free
                    <MdArrowForward className="text-lg" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                      bg-white/10 border border-white/30 text-white font-semibold rounded-xl
                      hover:bg-white/20 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-12 text-blue-200 text-sm">
              {['Free to use', 'No credit card', 'Instant access'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <MdCheckCircle className="text-green-400 text-base" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A complete platform built for applicants and administrators with powerful tools and a clean interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => {
              const c = colorMap[color] || colorMap.blue;
              return (
                <div
                  key={title}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100
                    dark:border-gray-800 hover:shadow-card-hover hover:-translate-y-0.5
                    transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.bg}`}>
                    <Icon className={`text-2xl ${c.icon}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Three simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gray-200 dark:bg-gray-700" />

            {[
              { step: '01', icon: MdPeople,     title: 'Create Account',     desc: 'Register with your email and complete your profile in under 2 minutes.' },
              { step: '02', icon: MdAssignment, title: 'Submit Application',  desc: 'Fill in the application form, upload your resume, and write your cover letter.' },
              { step: '03', icon: MdTrackChanges, title: 'Track Progress',   desc: 'Monitor your application status and get notified of any updates.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center
                  shadow-lg mb-4 relative z-10">
                  <Icon className="text-white text-2xl" />
                </div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">STEP {step}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="py-20 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join hundreds of students who have already applied through InternHub.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700
                font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg
                hover:shadow-xl hover:-translate-y-0.5"
            >
              <MdRocketLaunch className="text-xl" />
              Create Free Account
              <MdArrowForward />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
