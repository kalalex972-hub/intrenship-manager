// ============================================================
// utils/constants.js — Shared Application Constants
// Used across forms, filters, badges, and charts
// ============================================================

// ─── Internship Positions ─────────────────────────────────────
export const POSITIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Product Manager',
  'Business Analyst',
  'Marketing Intern',
  'Human Resources Intern',
  'Finance Intern',
  'Other',
];

// ─── Application Statuses ─────────────────────────────────────
export const STATUSES = [
  { value: 'pending',  label: 'Pending',  color: 'amber' },
  { value: 'reviewed', label: 'Reviewed', color: 'blue' },
  { value: 'accepted', label: 'Accepted', color: 'emerald' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
];

// ─── Status Badge Styles (Tailwind classes) ───────────────────
export const STATUS_STYLES = {
  pending: {
    bg:   'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot:  'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
  },
  reviewed: {
    bg:   'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot:  'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
  },
  accepted: {
    bg:   'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot:  'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  rejected: {
    bg:   'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot:  'bg-red-500',
    border: 'border-red-200 dark:border-red-800',
  },
};

// ─── Sort Options ─────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name',   label: 'Name (A–Z)' },
  { value: 'cgpa',   label: 'CGPA (High–Low)' },
];

// ─── Pagination Defaults ──────────────────────────────────────
export const PAGE_SIZES = [5, 10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

// ─── File Upload Limits ───────────────────────────────────────
export const MAX_RESUME_SIZE_MB   = 5;
export const MAX_PROFILE_SIZE_MB  = 2;
export const ACCEPTED_RESUME_TYPES  = ['application/pdf'];
export const ACCEPTED_IMAGE_TYPES   = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// ─── Validation Rules ─────────────────────────────────────────
export const VALIDATION = {
  username:     { min: 3, max: 30 },
  fullName:     { min: 2, max: 100 },
  password:     { min: 8 },
  coverLetter:  { min: 100, max: 2000 },
  cgpa:         { min: 0, max: 4 },
  maxSkills:    20,
};

// ─── Nav Links ────────────────────────────────────────────────
export const APPLICANT_NAV = [
  { path: '/dashboard',         label: 'Dashboard',        icon: 'MdDashboard' },
  { path: '/my-applications',   label: 'My Applications',  icon: 'MdAssignment' },
  { path: '/apply',             label: 'Apply Now',        icon: 'MdAddCircle' },
  { path: '/profile',           label: 'Profile',          icon: 'MdPerson' },
  { path: '/settings',          label: 'Settings',         icon: 'MdSettings' },
];

export const ADMIN_NAV = [
  { path: '/admin/dashboard',     label: 'Dashboard',     icon: 'MdDashboard' },
  { path: '/admin/applications',  label: 'Applications',  icon: 'MdAssignment' },
  { path: '/admin/users',         label: 'Users',         icon: 'MdPeople' },
  { path: '/admin/reports',       label: 'Reports',       icon: 'MdBarChart' },
];

// ─── Chart Colors ─────────────────────────────────────────────
export const CHART_COLORS = {
  primary:  'rgba(37, 99, 235, 0.8)',
  success:  'rgba(16, 185, 129, 0.8)',
  warning:  'rgba(245, 158, 11, 0.8)',
  danger:   'rgba(239, 68, 68, 0.8)',
  info:     'rgba(59, 130, 246, 0.8)',
  purple:   'rgba(139, 92, 246, 0.8)',
  pink:     'rgba(236, 72, 153, 0.8)',
  orange:   'rgba(249, 115, 22, 0.8)',
};

export const STATUS_CHART_COLORS = {
  pending:  'rgba(245, 158, 11, 0.8)',
  reviewed: 'rgba(59, 130, 246, 0.8)',
  accepted: 'rgba(16, 185, 129, 0.8)',
  rejected: 'rgba(239, 68, 68, 0.8)',
};

// ─── API Base URL ─────────────────────────────────────────────
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';
