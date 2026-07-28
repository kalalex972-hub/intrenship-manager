// ============================================================
// components/common/StatusBadge.jsx
// Displays a colored pill badge for application status
// ============================================================

import { STATUS_STYLES } from '../../utils/constants';

const StatusBadge = ({ status, size = 'md', showDot = true }) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.pending;

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border
        ${sizes[size]} ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      )}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

export default StatusBadge;
