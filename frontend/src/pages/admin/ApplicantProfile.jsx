// ============================================================
// pages/admin/ApplicantProfile.jsx
// Admin view of a single applicant's profile + their applications
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdEmail, MdPhone, MdCalendarToday, MdAssignment } from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getFileUrl, getInitials, getCgpaColor } from '../../utils/helpers';

const ApplicantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getApplicantProfile(id);
        setData(res);
      } catch {
        toast.error('Applicant not found.');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]); // eslint-disable-line

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="xl" text="Loading..." /></div>;
  if (!data)   return null;

  const { user, applications } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
            dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <MdArrowBack className="text-lg" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Applicant Profile</h2>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            {user.profilePicture ? (
              <img src={getFileUrl(user.profilePicture)} alt=""
                className="w-16 h-16 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center
                text-white text-xl font-bold border-4 border-white dark:border-gray-900 shadow-lg">
                {getInitials(user.fullName)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <InfoItem icon={MdEmail}        label="Email"    value={user.email} />
            <InfoItem icon={MdPhone}        label="Phone"    value={user.phone || 'Not provided'} />
            <InfoItem icon={MdCalendarToday} label="Joined"  value={formatDate(user.createdAt)} />
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <MdAssignment className="text-blue-600 text-lg" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Applications ({applications.length})
            </h3>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <MdAssignment className="text-5xl mb-2" />
            <p className="text-sm">No applications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {applications.map((app) => (
              <Link key={app._id} to={`/admin/applications/${app._id}`}
                className="flex items-center justify-between px-5 py-4
                  hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{app.position}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {app.university} · {app.department} ·
                    <span className={`ml-1 font-medium ${getCgpaColor(app.cgpa)}`}>
                      CGPA {app.cgpa?.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                    Applied {formatDateTime(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="text-gray-500 dark:text-gray-400 text-lg" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

export default ApplicantProfile;
