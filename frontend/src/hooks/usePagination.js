// ============================================================
// hooks/usePagination.js — Pagination State Management
// Usage: const { page, limit, totalPages, goTo, next, prev } = usePagination(total);
// ============================================================

import { useState, useMemo } from 'react';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

const usePagination = (total = 0, defaultLimit = DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const goTo = (newPage) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setPage(clamped);
  };

  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);
  const first = () => goTo(1);
  const last = () => goTo(totalPages);

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when page size changes
  };

  const reset = () => {
    setPage(1);
    setLimit(defaultLimit);
  };

  // Build page number array for pagination UI (with ellipsis logic)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    }
    return [1, '...', page-1, page, page+1, '...', totalPages];
  }, [page, totalPages]);

  return {
    page,
    limit,
    totalPages,
    pageNumbers,
    isFirst: page === 1,
    isLast: page === totalPages,
    goTo,
    next,
    prev,
    first,
    last,
    changeLimit,
    reset,
  };
};

export default usePagination;
