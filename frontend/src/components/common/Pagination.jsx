// ============================================================
// components/common/Pagination.jsx
// Reusable pagination bar with page numbers, prev/next, and page size selector
// ============================================================

import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md';
import { PAGE_SIZES } from '../../utils/constants';

const Pagination = ({
  page,
  totalPages,
  pageNumbers,
  isFirst,
  isLast,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onGoTo,
  total,
  limit,
  onLimitChange,
  showPageSize = true,
}) => {
  if (totalPages <= 1 && total <= limit) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Results info */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{start}</span>–
        <span className="font-semibold text-gray-900 dark:text-white">{end}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> results
      </p>

      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showPageSize && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        )}

        {/* Nav buttons */}
        <div className="flex items-center gap-1">
          <NavBtn onClick={onFirst} disabled={isFirst} label="First" icon={<MdFirstPage />} />
          <NavBtn onClick={onPrev}  disabled={isFirst} label="Previous" icon={<MdChevronLeft />} />

          {pageNumbers.map((num, i) =>
            num === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={num}
                onClick={() => onGoTo(num)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${page === num
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {num}
              </button>
            )
          )}

          <NavBtn onClick={onNext} disabled={isLast} label="Next"  icon={<MdChevronRight />} />
          <NavBtn onClick={onLast} disabled={isLast} label="Last"  icon={<MdLastPage />} />
        </div>
      </div>
    </div>
  );
};

const NavBtn = ({ onClick, disabled, label, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors
      ${disabled
        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
  >
    {icon}
  </button>
);

export default Pagination;
