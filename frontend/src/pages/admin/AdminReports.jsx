// ============================================================
// pages/admin/AdminReports.jsx
// Analytics: status counts, monthly chart, top unis/positions,
// CGPA distribution, export buttons
// ============================================================

import { useEffect, useState } from 'react';
import { MdFileDownload, MdBarChart } from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import MonthlyChart from '../../components/charts/MonthlyChart';
import StatusPieChart from '../../components/charts/StatusPieChart';
import TopPositionsChart from '../../components/charts/TopPositionsChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { exportToPDF, exportToExcel } from '../../utils/helpers';

const AdminReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminService.getReports();
        setReports(data.reports);
      } catch {
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // eslint-disable-line

  const handleExportAll = async (type) => {
    setExporting(true);
    try {
      // Fetch all applications for export
      const data = await adminService.getAllApplications({ limit: 1000 });
      if (type === 'pdf') {
        await exportToPDF(data.applications, 'full_report');
        toast.success('PDF report exported.');
      } else {
        await exportToExcel(data.applications, 'full_report');
        toast.success('Excel report exported.');
      }
    } catch { toast.error('Export failed.'); }
    finally { setExporting(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <LoadingSpinner size="xl" text="Loading reports..." />
    </div>
  );

  const stats   = reports?.statusCounts || {};
  const monthly = reports?.monthlyApplications || [];
  const unis    = reports?.topUniversities || [];
  const pos     = reports?.topPositions || [];
  const cgpa    = reports?.cgpaDistribution || [];

  const cgpaLabels = { 0: '0–1.0', 1: '1.0–2.0', 2: '2.0–3.0', 3: '3.0–3.5', 3.5: '3.5–4.0' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Comprehensive overview of all internship applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExportAll('pdf')} disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400
              border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
            {exporting ? <LoadingSpinner size="sm" /> : <MdFileDownload />} PDF
          </button>
          <button onClick={() => handleExportAll('excel')} disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400
              border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50">
            {exporting ? <LoadingSpinner size="sm" /> : <MdFileDownload />} Excel
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total',    value: stats.total,    bg: 'bg-blue-50 dark:bg-blue-900/20',    text: 'text-blue-700 dark:text-blue-300' },
          { label: 'Pending',  value: stats.pending,  bg: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-700 dark:text-amber-300' },
          { label: 'Reviewed', value: stats.reviewed, bg: 'bg-blue-50 dark:bg-blue-900/20',    text: 'text-blue-700 dark:text-blue-300' },
          { label: 'Accepted', value: stats.accepted, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300' },
          { label: 'Rejected', value: stats.rejected, bg: 'bg-red-50 dark:bg-red-900/20',     text: 'text-red-700 dark:text-red-300' },
        ].map(({ label, value, bg, text }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${text}`}>{value ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MdBarChart className="text-blue-600" /> Monthly Applications Trend
          </h3>
          <MonthlyChart data={monthly} />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status Breakdown</h3>
          <StatusPieChart stats={stats} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Universities */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Universities</h3>
          {unis.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {unis.map((item, i) => {
                const max = unis[0].count;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={item.university} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4 font-bold">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-900 dark:text-white truncate">{item.university}</span>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Positions chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Most Applied Positions</h3>
          <TopPositionsChart data={pos} />
        </div>
      </div>

      {/* CGPA Distribution */}
      {cgpa.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">CGPA Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cgpa.map((bucket) => (
              <div key={bucket._id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bucket.count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  CGPA {cgpaLabels[bucket._id] || bucket._id}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
