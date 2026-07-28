// ============================================================
// pages/applicant/Dashboard.jsx
// Shows applicant stats, recent applications, quick actions
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAssignment, MdCheckCircle, MdHourglassEmpty, MdCancel,
  MdRateReview, MdAddCircle, MdArrowForward, MdPerson,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import applicationService from '../../services/applicationService';
import DashboardCard from '../../components/common/DashboardCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getFileUrl, getInitials } from '../../utils/helpers';

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats]   = useState({ total: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await applicationService.getMyApplications({ limit: 5, sort: 'newest' });
        const apps = data.applications || [];
        setRecent(apps);
        // Compute counts from full list for stats
        const countData = await applicationService.getMyApplications({ limit: 100 });
        const all = countData.applications || [];
        setStats({
          total:    all.length,
          pending:  all.filter((a) => a.status === 'pending').length,
          reviewed: all.filter((a) => a.status === 'reviewed').length,
          accepted: all.filter((a) => a.status === 'accepted').length,
          rejected: all.filter((a) => a.status === 'rejected').length,
        });
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // eslint-disable-line

  const cards = [
    { title: 'Total Applications', value: stats.total,    icon: MdAssignment,     color: 'blue' },
    { title: 'Pending',            value: stats.pending,  icon: MdHourglassEmpty, color: 'amber' },
    { title: 'Reviewed',           value: stats.reviewed, icon: MdRateReview,     color: 'blue' },
    { title: 'Accepted',           value: stats.accepted, icon: MdCheckCircle,    color: 'emerald' },
    { title: 'Rejected',           value: stats.rejected, icon: MdCancel,         color: 'red' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <img src={getFileUrl(user.profilePicture)} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {getInitials(user?.fullName)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h2>
            <p className="text-blue-100 text-sm mt-0.5">
              {stats.total === 0
                ? 'You have no applications yet. Apply for your first internship!'
                : `You have ${stats.total} application${stats.total > 1 ? 's' : ''} in total.`}
            </p>
          </div>
        </div>
        <Link
          to="/apply"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-blue-700
            text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
        >
          <MdAddCircle className="text-lg" /> Apply for Internship
        </Link>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="flex justify-center py-8"><LoadingSpinner size="lg" text="Loading stats..." /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Recent applications */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
          <Link to="/my-applications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View all <MdArrowForward />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
            <MdAssignment className="text-5xl mb-3" />
            <p className="text-sm font-medium">No applications yet</p>
            <Link to="/apply" className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Submit your first application →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map((app) => (
              <Link
                key={app._id}
                to={`/my-applications`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50
                  dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {app.position}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {app.university} · Applied {formatDate(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/apply"
          className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border
            border-gray-100 dark:border-gray-800 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <MdAddCircle className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">New Application</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Apply for a new internship</p>
          </div>
          <MdArrowForward className="ml-auto text-gray-400" />
        </Link>

        <Link to="/profile"
          className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border
            border-gray-100 dark:border-gray-800 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <div className="w-11 h-11 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <MdPerson className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Update Profile</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Edit your personal information</p>
          </div>
          <MdArrowForward className="ml-auto text-gray-400" />
        </Link>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
