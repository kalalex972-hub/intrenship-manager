// ============================================================
// components/common/SearchBar.jsx
// Search input with debounce, clear button, and loading indicator
// ============================================================

import { useState, useEffect } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 500,
  className = '',
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  // Trigger onSearch whenever debounced value changes
  useEffect(() => {
    if (onSearch) onSearch(debouncedValue);
  }, [debouncedValue]); // eslint-disable-line

  const handleClear = () => {
    setValue('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200
          dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
            hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <MdClose className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
