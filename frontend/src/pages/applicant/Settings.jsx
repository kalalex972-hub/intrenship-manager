// ============================================================
// pages/applicant/Settings.jsx
// Theme toggle, account info, danger zone (logout)
// ============================================================

import { useNavigate } from 'react-router-dom';
import { MdDarkMode, MdLightMode, MdLogout, MdPerson, MdInfo } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Appearance */}
      <SettingsCard title="Appearance" icon={isDark ? MdLightMode : MdDarkMode}>
        <SettingRow
          label="Dark Mode"
          description="Toggle between light and dark interface"
        >
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            role="switch"
            aria-checked={isDark}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
              ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </SettingRow>
      </SettingsCard>

      {/* Account Info */}
      <SettingsCard title="Account Information" icon={MdPerson}>
        {[
          { label: 'Username',    value: `@${user?.username}` },
          { label: 'Email',       value: user?.email },
          { label: 'Role',        value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
          { label: 'Member Since',value: formatDate(user?.createdAt) },
        ].map(({ label, value }) => (
          <SettingRow key={label} label={label} description={value} />
        ))}
      </SettingsCard>

      {/* About */}
      <SettingsCard title="About" icon={MdInfo}>
        <SettingRow label="Application" description="InternHub — Internship Application Manager" />
        <SettingRow label="Version" description="1.0.0" />
        <SettingRow label="Stack" description="MERN Stack (MongoDB, Express, React, Node.js)" />
      </SettingsCard>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Sign out of InternHub</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You will need to sign in again to access your account.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700
              text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <MdLogout className="text-base" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="text-xl text-blue-600 dark:text-blue-400" />
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-0 divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
  </div>
);

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
    </div>
    {children && <div className="ml-4 flex-shrink-0">{children}</div>}
  </div>
);

export default Settings;
