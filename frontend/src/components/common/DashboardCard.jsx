// ============================================================
// components/common/DashboardCard.jsx
// Stat card for dashboards — icon, value, label, color accent
// ============================================================

import LoadingSpinner from './LoadingSpinner';

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  loading = false,
  subtitle = '',
  onClick,
}) => {
  const colorMap = {
    blue: {
      bg:      'bg-blue-50 dark:bg-blue-900/20',
      iconBg:  'bg-blue-100 dark:bg-blue-800',
      icon:    'text-blue-600 dark:text-blue-400',
      value:   'text-blue-700 dark:text-blue-300',
      border:  'border-blue-100 dark:border-blue-800',
    },
    amber: {
      bg:      'bg-amber-50 dark:bg-amber-900/20',
      iconBg:  'bg-amber-100 dark:bg-amber-800',
      icon:    'text-amber-600 dark:text-amber-400',
      value:   'text-amber-700 dark:text-amber-300',
      border:  'border-amber-100 dark:border-amber-800',
    },
    emerald: {
      bg:      'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg:  'bg-emerald-100 dark:bg-emerald-800',
      icon:    'text-emerald-600 dark:text-emerald-400',
      value:   'text-emerald-700 dark:text-emerald-300',
      border:  'border-emerald-100 dark:border-emerald-800',
    },
    red: {
      bg:      'bg-red-50 dark:bg-red-900/20',
      iconBg:  'bg-red-100 dark:bg-red-800',
      icon:    'text-red-600 dark:text-red-400',
      value:   'text-red-700 dark:text-red-300',
      border:  'border-red-100 dark:border-red-800',
    },
    purple: {
      bg:      'bg-purple-50 dark:bg-purple-900/20',
      iconBg:  'bg-purple-100 dark:bg-purple-800',
      icon:    'text-purple-600 dark:text-purple-400',
      value:   'text-purple-700 dark:text-purple-300',
      border:  'border-purple-100 dark:border-purple-800',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition-all duration-200
        ${c.bg} ${c.border}
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>

          {loading ? (
            <div className="mt-2">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <p className={`text-3xl font-bold mt-1 ${c.value}`}>
              {value ?? '—'}
            </p>
          )}

          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${c.iconBg}`}>
            <Icon className={`text-2xl ${c.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
