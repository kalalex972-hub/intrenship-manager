// ============================================================
// components/common/LoadingSpinner.jsx
// Reusable spinner with size and color variants
// ============================================================

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-blue-600 border-t-transparent',
    white:   'border-white border-t-transparent',
    gray:    'border-gray-400 border-t-transparent',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
