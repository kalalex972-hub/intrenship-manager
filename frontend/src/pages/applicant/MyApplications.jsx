// ============================================================
// pages/applicant/MyApplications.jsx
// Lists the applicant's own applications with filter, sort, pagination
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAddCircle, MdAssignment, MdDelete, MdEdit,
  MdOpenInNew, MdFilterList,
} from 'react-icons/md';
import applicationService from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePagination from '../../hooks/usePagination';
import { formatDate, getFileUrl } from '../../utils/helpers';
import { STATUSES, SORT_OPTIONS } from '../../utils/constants';

const MyApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [deleteId, setDeleteId]         = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [filters, setFilters]           = useState({ status: '', sort: 'newest' });

  const pagination = usePagination(total);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applicationService.getMyApplications({
        status: filters.status || undefined,
        sort:   filters.sort,
        page:   pagination.page,
        limit:  pagination.limit,
      });
      setApplications(data.applications || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]); // eslint-disable-line

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await applicationService.delete(deleteId);
      toast.success('Application deleted successfully.');
      setDeleteId(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Applications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total} application{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/apply"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
          <MdAddCircle className="text-lg" /> New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MdFilterList className="text-lg text-blue-600" /> Filters:
        </div>
        {/* Status */}
        <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); pagination.reset(); }}
          className={selCls}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {/* Sort */}
        <select value={filters.sort} onChange={(e) => { setFilters((f) => ({ ...f, sort: e.target.value })); pagination.reset(); }}
          className={selCls}>
          {SORT_OPTIONS.filter((s) => ['newest','oldest'].includes(s.value)).map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading..." /></div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <MdAssignment className="text-6xl text-gray-300 dark:text-gray-600 mb-3" />
          <p className="font-semibold text-gray-500 dark:text-gray-400">No applications found</p>
          <Link to="/apply" className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Apply for an internship →
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <div className="col-span-4">Position</div>
            <div className="col-span-3">University</div>
            <div className="col-span-1 text-center">CGPA</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-center">Applied</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {applications.map((app) => (
              <div key={app._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4
                  hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                {/* Position */}
                <div className="md:col-span-4 flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{app.position}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{app.department}</span>
                </div>
                {/* University */}
                <div className="md:col-span-3 flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{app.university}</span>
                </div>
                {/* CGPA */}
                <div className="md:col-span-1 flex items-center md:justify-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{app.cgpa?.toFixed(2)}</span>
                </div>
                {/* Status */}
                <div className="md:col-span-2 flex items-center md:justify-center">
                  <StatusBadge status={app.status} />
                </div>
                {/* Date */}
                <div className="md:col-span-1 flex items-center md:justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(app.createdAt)}</span>
                </div>
                {/* Actions */}
                <div className="md:col-span-1 flex items-center gap-2 md:justify-center">
                  {/* View resume */}
                  {app.resume && (
                    <a href={getFileUrl(app.resume)} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                        hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                      title="View Resume">
                      <MdOpenInNew className="text-base" />
                    </a>
                  )}
                  {/* Delete (pending only) */}
                  {app.status === 'pending' && (
                    <button onClick={() => setDeleteId(app._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                        hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
                      title="Delete Application">
                      <MdDelete className="text-base" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageNumbers={pagination.pageNumbers}
          isFirst={pagination.isFirst}
          isLast={pagination.isLast}
          onFirst={pagination.first}
          onPrev={pagination.prev}
          onNext={pagination.next}
          onLast={pagination.last}
          onGoTo={pagination.goTo}
          total={total}
          limit={pagination.limit}
          onLimitChange={pagination.changeLimit}
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

const selCls = `text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5
  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
  focus:outline-none focus:ring-2 focus:ring-blue-500`;

export default MyApplications;
