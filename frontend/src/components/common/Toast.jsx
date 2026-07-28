// ============================================================
// components/common/Toast.jsx
// Renders all active toast notifications from ToastContext
// Position: top-right, stacked with animation
// ============================================================

import { useToast } from '../../context/ToastContext';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';

const TOAST_CONFIG = {
  success: {
    icon:    MdCheckCircle,
    bg:      'bg-emerald-50 dark:bg-emerald-900/30',
    border:  'border-emerald-200 dark:border-emerald-700',
    text:    'text-emerald-800 dark:text-emerald-200',
    iconCls: 'text-emerald-500',
    bar:     'bg-emerald-500',
  },
  error: {
    icon:    MdError,
    bg:      'bg-red-50 dark:bg-red-900/30',
    border:  'border-red-200 dark:border-red-700',
    text:    'text-red-800 dark:text-red-200',
    iconCls: 'text-red-500',
    bar:     'bg-red-500',
  },
  warning: {
    icon:    MdWarning,
    bg:      'bg-amber-50 dark:bg-amber-900/30',
    border:  'border-amber-200 dark:border-amber-700',
    text:    'text-amber-800 dark:text-amber-200',
    iconCls: 'text-amber-500',
    bar:     'bg-amber-500',
  },
  info: {
    icon:    MdInfo,
    bg:      'bg-blue-50 dark:bg-blue-900/30',
    border:  'border-blue-200 dark:border-blue-700',
    text:    'text-blue-800 dark:text-blue-200',
    iconCls: 'text-blue-500',
    bar:     'bg-blue-500',
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 w-full max-w-sm p-4 rounded-xl shadow-lg border
        backdrop-blur-sm animate-slide-down overflow-hidden
        ${config.bg} ${config.border}`}
      role="alert"
    >
      {/* Color bar on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />

      <Icon className={`text-xl flex-shrink-0 mt-0.5 ${config.iconCls}`} />

      <p className={`flex-1 text-sm font-medium ${config.text}`}>
        {toast.message}
      </p>

      <button
        onClick={() => onDismiss(toast.id)}
        className={`flex-shrink-0 hover:opacity-70 transition-opacity ${config.text}`}
        aria-label="Dismiss"
      >
        <MdClose className="text-lg" />
      </button>
    </div>
  );
};

const Toast = () => {
  const { toasts, dismissToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default Toast;
