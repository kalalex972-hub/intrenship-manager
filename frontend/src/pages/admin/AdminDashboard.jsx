// ============================================================
// pages/admin/AdminDashboard.jsx
// Stats cards, charts, recent applications, top universities
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  MdPeople, MdAssignment, MdCheckCircle, MdCancel,
  MdHourglassEmpty, MdRateReview, MdArrowForward,
} from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import DashboardCard from '../../components/common/DashboardCard';
import StatusBadge from '../../components/common/StatusBadge';
import MonthlyChart from '../../components/charts/MonthlyChart';
import StatusPieChart from '../../components/charts/StatusPieChart';
import TopPositionsChart from '../../components/charts/TopPositionsChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getInitials, getFileUrl } from '../../utils/helpers';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getDashboard();
        setData(res.dashboard);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // eslint-disable-line

  const stats = data?.stats || {};

  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: MdAssignment,
      color: 'blue',
      onClick: () => navigate('/admin/applications'),
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: MdHourglassEmpty,
      color: 'amber',
      onClick: () => navigate('/admin/applications?status=pending'),
    },
    {
      title: 'Reviewed',
      value: stats.reviewed,
      icon: MdRateReview,
      color: 'blue',
      onClick: () => navigate('/admin/applications?status=reviewed'),
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: MdCheckCircle,
      color: 'emerald',
      onClick: () => navigate('/admin/applications?status=accepted'),
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: MdCancel,
      color: 'red',
      onClick: () => navigate('/admin/applications?status=rejected'),
    },
    {
      title: 'Total Applicants',
      value: stats.totalUsers,
      icon: MdPeople,
      color: 'purple',
      onClick: () => navigate('/admin/users'),
    },
  ];

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <LoadingSpinner size="xl" text="Loading dashboard..." />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart — takes 2 cols */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Applications</h3>
          <MonthlyChart data={data?.monthlyApplications || []} />
        </div>

        {/* Doughnut — 1 col */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
          <StatusPieChart stats={stats} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
            <Link to="/admin/applications"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <MdArrowForward />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {(data?.recentApplications || []).length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No applications yet.</p>
            ) : (
              (data?.recentApplications || []).map((app) => (
                <Link key={app._id} to={`/admin/applications/${app._id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  {/* Avatar */}
                  {app.applicant?.profilePicture ? (
                    <img src={getFileUrl(app.applicant.profilePicture)} alt=""
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
                      text-white text-xs font-bold flex-shrink-0">
                      {getInitials(app.applicant?.fullName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {app.applicant?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {app.position} · {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top positions chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Positions</h3>
          <TopPositionsChart data={data?.topPositions || []} />
        </div>
      </div>

      {/* Top Universities */}
      {(data?.topUniversities || []).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Universities</h3>
          <div className="space-y-3">
            {data.topUniversities.map((item, idx) => {
              const max = data.topUniversities[0].count;
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={item.university} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.university}</span>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
