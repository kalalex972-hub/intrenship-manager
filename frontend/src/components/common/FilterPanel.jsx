// ============================================================
// components/common/FilterPanel.jsx
// Filter bar: status, position, sort, date range
// ============================================================

import { MdFilterList, MdClear } from 'react-icons/md';
import { STATUSES, POSITIONS, SORT_OPTIONS } from '../../utils/constants';

const FilterPanel = ({ filters, onChange, onClear, showDateFilter = true }) => {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== '' && v !== undefined && v !== null
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <MdFilterList className="text-lg text-blue-600" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {Object.values(filters).filter((v) => v && v !== '').length}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700
              dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            <MdClear /> Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onChange('status', e.target.value)}
            className={selectCls}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Position Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Position
          </label>
          <select
            value={filters.position || ''}
            onChange={(e) => onChange('position', e.target.value)}
            className={selectCls}
          >
            <option value="">All Positions</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onChange('sort', e.target.value)}
            className={selectCls}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        {showDateFilter && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onChange('dateFrom', e.target.value)}
              className={selectCls}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const selectCls = `w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200
  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`;

export default FilterPanel;
