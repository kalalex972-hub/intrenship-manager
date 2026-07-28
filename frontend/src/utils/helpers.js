// ============================================================
// utils/helpers.js — Pure Utility Functions
// Date formatting, file helpers, error extractors, exporters
// ============================================================

import { UPLOADS_URL } from './constants';

// ─── Date Formatting ──────────────────────────────────────────

/**
 * Format an ISO date string to "Jan 15, 2024"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format an ISO date string to "Jan 15, 2024 at 3:45 PM"
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Returns a relative time string: "2 hours ago", "3 days ago", etc.
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);

  const intervals = [
    { label: 'year',   secs: 31536000 },
    { label: 'month',  secs: 2592000 },
    { label: 'week',   secs: 604800 },
    { label: 'day',    secs: 86400 },
    { label: 'hour',   secs: 3600 },
    { label: 'minute', secs: 60 },
  ];

  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

// ─── File Helpers ─────────────────────────────────────────────

/**
 * Build full URL for a server-hosted file
 * e.g. "uploads/resumes/file.pdf" → "http://localhost:5000/uploads/resumes/file.pdf"
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${UPLOADS_URL}/${filePath}`;
};

/**
 * Format file size in human-readable form
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validate file type and size before upload
 * Returns { valid: boolean, error: string|null }
 */
export const validateFile = (file, allowedTypes, maxSizeMB) => {
  if (!file) return { valid: false, error: 'No file selected.' };

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }

  return { valid: true, error: null };
};

// ─── String Helpers ───────────────────────────────────────────

/**
 * Get initials from a full name: "John Doe" → "JD"
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Truncate a string with ellipsis
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

// ─── CGPA Helper ──────────────────────────────────────────────

/**
 * Returns a color class based on CGPA value
 */
export const getCgpaColor = (cgpa) => {
  if (cgpa >= 3.5) return 'text-emerald-600 dark:text-emerald-400';
  if (cgpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
  if (cgpa >= 2.5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

// ─── Error Message Extractor ──────────────────────────────────

/**
 * Extract a user-friendly error message from an Axios error response
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // Axios response error
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios response with errors array (validation)
  if (error.response?.data?.errors?.length > 0) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }

  // Network error
  if (error.message) return error.message;

  return 'An unexpected error occurred.';
};

// ─── Export to PDF ────────────────────────────────────────────

/**
 * Export applications array to PDF using jsPDF + autotable
 */
export const exportToPDF = async (applications, filename = 'applications') => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.text('Internship Applications Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 22);

  const headers = [['#', 'Name', 'Email', 'University', 'Position', 'CGPA', 'Status', 'Applied']];
  const rows = applications.map((app, i) => [
    i + 1,
    app.applicant?.fullName || 'N/A',
    app.applicant?.email || 'N/A',
    app.university,
    app.position,
    app.cgpa?.toFixed(2),
    app.status?.toUpperCase(),
    formatDate(app.createdAt),
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ─── Export to Excel ──────────────────────────────────────────

/**
 * Export applications array to Excel using xlsx
 */
export const exportToExcel = async (applications, filename = 'applications') => {
  const XLSX = await import('xlsx');

  const data = applications.map((app, i) => ({
    '#': i + 1,
    'Full Name':    app.applicant?.fullName || 'N/A',
    'Email':        app.applicant?.email || 'N/A',
    'Phone':        app.phone,
    'University':   app.university,
    'Department':   app.department,
    'CGPA':         app.cgpa,
    'Position':     app.position,
    'Skills':       app.skills?.join(', ') || '',
    'Status':       app.status,
    'Applied Date': formatDate(app.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Applications');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// ─── Build FormData from object ───────────────────────────────

/**
 * Convert a plain object to FormData (handles arrays and files)
 */
export const buildFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
};
