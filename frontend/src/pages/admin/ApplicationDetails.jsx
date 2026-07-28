// ============================================================
// pages/admin/ApplicationDetails.jsx
// Full detail view of one application with status update form
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack, MdSave, MdOpenInNew, MdPerson, MdSchool,
  MdWork, MdDescription, MdAdminPanelSettings,
} from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getFileUrl, getInitials, getCgpaColor } from '../../utils/helpers';
import { STATUSES } from '../../utils/constants';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [app, setApp]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState('');
  const [notes, setNotes]       = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const data = await adminService.getApplicationById(id);
        setApp(data.application);
        setStatus(data.application.status);
        setNotes(data.application.adminNotes || '');
      } catch {
        toast.error('Application not found.');
        navigate('/admin/applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]); // eslint-disable-line

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminService.updateApplicationStatus(id, { status, adminNotes: notes });
      setApp(data.application);
      toast.success(`Status updated to "${status}".`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="xl" text="Loading..." /></div>;
  if (!app)    return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
            dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <MdArrowBack className="text-lg" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {app.applicant?.fullName} — {app.position}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Applied {formatDateTime(app.createdAt)}
          </p>
        </div>
        <StatusBadge status={app.status} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Applicant info */}
          <DetailCard title="Applicant Information" icon={MdPerson}>
            <div className="flex items-center gap-4 mb-4">
              {app.applicant?.profilePicture ? (
                <img src={getFileUrl(app.applicant.profilePicture)} alt=""
                  className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {getInitials(app.applicant?.fullName)}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{app.applicant?.fullName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{app.applicant?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</p>
              </div>
            </div>
            <Link to={`/admin/users/${app.applicant?._id}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <MdPerson className="text-base" /> View full profile
            </Link>
          </DetailCard>

          {/* Academic */}
          <DetailCard title="Academic Information" icon={MdSchool}>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="University"  value={app.university} />
              <InfoField label="Department"  value={app.department} />
              <InfoField label="CGPA"
                value={<span className={`font-semibold ${getCgpaColor(app.cgpa)}`}>{app.cgpa?.toFixed(2)} / 4.0</span>}
              />
              <InfoField label="Applied For" value={app.position} />
            </div>
          </DetailCard>

          {/* Skills */}
          {app.skills?.length > 0 && (
            <DetailCard title="Skills" icon={MdWork}>
              <div className="flex flex-wrap gap-2">
                {app.skills.map((s) => (
                  <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700
                    dark:text-blue-400 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </DetailCard>
          )}

          {/* Cover Letter */}
          <DetailCard title="Cover Letter" icon={MdDescription}>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {app.coverLetter}
            </p>
          </DetailCard>

          {/* Resume */}
          {app.resume && (
            <DetailCard title="Resume" icon={MdOpenInNew}>
              <a href={getFileUrl(app.resume)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                  text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                <MdOpenInNew className="text-base" />
                Open Resume (PDF)
              </a>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Uploaded: {formatDate(app.createdAt)}
              </p>
            </DetailCard>
          )}
        </div>

        {/* Right sidebar: status update */}
        <div className="space-y-5">
          <DetailCard title="Update Status" icon={MdAdminPanelSettings}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Application Status
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Admin Notes <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Add internal notes about this application..."
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500 resize-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{notes.length}/500</p>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600
                  hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors
                  disabled:opacity-60 shadow-sm">
                {saving ? <LoadingSpinner size="sm" color="white" /> : <MdSave className="text-base" />}
                Save Changes
              </button>
            </div>
          </DetailCard>

          {/* Quick info card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Application Info
            </h4>
            {[
              { label: 'Application ID', value: app._id.slice(-8).toUpperCase() },
              { label: 'Submitted',      value: formatDate(app.createdAt) },
              { label: 'Last Updated',   value: formatDate(app.updatedAt) },
              { label: 'Status',         value: <StatusBadge status={app.status} size="sm" /> },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="text-lg text-blue-600 dark:text-blue-400" />
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default ApplicationDetails;
