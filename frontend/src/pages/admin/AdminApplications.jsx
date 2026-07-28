// ============================================================
// pages/admin/AdminApplications.jsx
// Full applications table with search, filters, sort, pagination
// Export to PDF/Excel, bulk view, status update inline
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MdDelete, MdVisibility, MdFileDownload,
  MdAssignment, MdRefresh,
} from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePagination from '../../hooks/usePagination';
import { formatDate, getInitials, getFileUrl, exportToPDF, exportToExcel } from '../../utils/helpers';
import { getCgpaColor } from '../../utils/helpers';

const EMPTY_FILTERS = { status: '', position: '', sort: 'newest', dateFrom: '' };

const AdminApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [exporting, setExporting]       = useState(false);
  const [search, setSearch]             = useState('');
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [deleteId, setDeleteId]         = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const pagination = usePagination(total);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status:   filters.status || undefined,
        position: filters.position || undefined,
        sort:     filters.sort,
        dateFrom: filters.dateFrom || undefined,
        page:     pagination.page,
        limit:    pagination.limit,
      };
      const data = await adminService.getAllApplications(params);
      setApplications(data.applications || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [search, filters, pagination.page, pagination.limit]); // eslint-disable-line

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    pagination.reset();
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    pagination.reset();
  };

  const handleSearch = (val) => {
    setSearch(val);
    pagination.reset();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminService.deleteApplication(deleteId);
      toast.success('Application deleted.');
      setDeleteId(null);
      fetchApplications();
    } catch {
      toast.error('Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!applications.length) { toast.warning('No data to export.'); return; }
    setExporting(true);
    try {
      await exportToPDF(applications, 'admin_applications');
      toast.success('PDF exported successfully.');
    } catch { toast.error('Export failed.'); }
    finally { setExporting(false); }
  };

  const handleExportExcel = async () => {
    if (!applications.length) { toast.warning('No data to export.'); return; }
    setExporting(true);
    try {
      await exportToExcel(applications, 'admin_applications');
      toast.success('Excel exported successfully.');
    } catch { toast.error('Export failed.'); }
    finally { setExporting(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Applications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total} total application{total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={fetchApplications} title="Refresh"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
              dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <MdRefresh className="text-lg" />
          </button>
          <button onClick={handleExportPDF} disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400
              border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20
              transition-colors disabled:opacity-50">
            {exporting ? <LoadingSpinner size="sm" /> : <MdFileDownload className="text-base" />}
            PDF
          </button>
          <button onClick={handleExportExcel} disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400
              border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              transition-colors disabled:opacity-50">
            {exporting ? <LoadingSpinner size="sm" /> : <MdFileDownload className="text-base" />}
            Excel
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchBar placeholder="Search by name, email, university, position..." onSearch={handleSearch} className="w-full" />

      {/* Filters */}
      <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Loading applications..." /></div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <MdAssignment className="text-6xl text-gray-300 dark:text-gray-600 mb-3" />
          <p className="font-medium text-gray-500 dark:text-gray-400">No applications found</p>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-800/50
            text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <div className="col-span-3">Applicant</div>
            <div className="col-span-2">Position</div>
            <div className="col-span-2">University</div>
            <div className="col-span-1 text-center">CGPA</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-center">Applied</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {applications.map((app) => (
              <div key={app._id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3 px-5 py-4
                  hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">

                {/* Applicant */}
                <div className="lg:col-span-3 flex items-center gap-3 min-w-0">
                  {app.applicant?.profilePicture ? (
                    <img src={getFileUrl(app.applicant.profilePicture)} alt=""
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
                      text-white text-xs font-bold flex-shrink-0">
                      {getInitials(app.applicant?.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {app.applicant?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {app.applicant?.email}
                    </p>
                  </div>
                </div>

                {/* Position */}
                <div className="lg:col-span-2 flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{app.position}</span>
                </div>

                {/* University */}
                <div className="lg:col-span-2 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{app.university}</span>
                </div>

                {/* CGPA */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className={`text-sm font-semibold ${getCgpaColor(app.cgpa)}`}>
                    {app.cgpa?.toFixed(2)}
                  </span>
                </div>

                {/* Status */}
                <div className="lg:col-span-2 flex items-center lg:justify-center">
                  <StatusBadge status={app.status} />
                </div>

                {/* Date */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(app.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex items-center gap-1 lg:justify-center">
                  <Link to={`/admin/applications/${app._id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                      hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                    title="View Details">
                    <MdVisibility className="text-base" />
                  </Link>
                  <button onClick={() => setDeleteId(app._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                      hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
                    title="Delete">
                    <MdDelete className="text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          page={pagination.page} totalPages={pagination.totalPages}
          pageNumbers={pagination.pageNumbers} isFirst={pagination.isFirst}
          isLast={pagination.isLast} onFirst={pagination.first}
          onPrev={pagination.prev} onNext={pagination.next} onLast={pagination.last}
          onGoTo={pagination.goTo} total={total} limit={pagination.limit}
          onLimitChange={pagination.changeLimit}
        />
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Application"
        message="This will permanently delete the application and its resume file. This cannot be undone."
        confirmText="Delete" variant="danger"
      />
    </div>
  );
};

export default AdminApplications;
