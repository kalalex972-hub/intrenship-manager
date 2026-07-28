// ============================================================
// pages/applicant/Profile.jsx
// View and edit profile: name, phone, password, profile picture
// ============================================================

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  MdEdit, MdSave, MdLock, MdVisibility, MdVisibilityOff,
  MdCameraAlt, MdPerson, MdPhone, MdEmail, MdCalendarToday,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getFileUrl, getInitials, formatDate } from '../../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [editMode, setEditMode]           = useState(false);
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [previewUrl, setPreviewUrl]       = useState(null);
  const [profileFile, setProfileFile]     = useState(null);
  const [saving, setSaving]               = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName:        user?.fullName || '',
      phone:           user?.phone || '',
      currentPassword: '',
      newPassword:     '',
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 2MB.');
      return;
    }
    setProfileFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (data.fullName !== user.fullName) formData.append('fullName', data.fullName);
      if (data.phone !== user.phone)       formData.append('phone', data.phone);
      if (data.newPassword) {
        formData.append('currentPassword', data.currentPassword);
        formData.append('newPassword', data.newPassword);
      }
      if (profileFile) formData.append('profilePicture', profileFile);

      const result = await authService.updateProfile(formData);
      updateUser(result.user);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      setProfileFile(null);
      setPreviewUrl(null);
      reset({ fullName: result.user.fullName, phone: result.user.phone, currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setPreviewUrl(null);
    setProfileFile(null);
    reset({ fullName: user.fullName, phone: user.phone, currentPassword: '', newPassword: '' });
  };

  const avatarSrc = previewUrl || (user?.profilePicture ? getFileUrl(user.profilePicture) : null);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile header card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              {avatarSrc ? (
                <img src={avatarSrc} alt={user?.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-600 border-4 border-white dark:border-gray-900 shadow-lg
                  flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user?.fullName)}
                </div>
              )}
              {editMode && (
                <>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full
                      flex items-center justify-center text-white shadow-md transition-colors">
                    <MdCameraAlt className="text-sm" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </>
              )}
            </div>

            {!editMode ? (
              <button onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                  text-sm font-medium rounded-xl transition-colors shadow-sm">
                <MdEdit className="text-base" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400
                    bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button form="profile-form" type="submit" disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                    text-sm font-medium rounded-xl transition-colors disabled:opacity-60 shadow-sm">
                  {saving ? <LoadingSpinner size="sm" color="white" /> : <MdSave className="text-base" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Name and role */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
          <span className="inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400
            px-2.5 py-0.5 rounded-full font-medium capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Profile form / info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        {!editMode ? (
          /* Read-only view */
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            {[
              { icon: MdPerson,        label: 'Full Name',   value: user?.fullName },
              { icon: MdEmail,         label: 'Email',       value: user?.email },
              { icon: MdPhone,         label: 'Phone',       value: user?.phone || 'Not provided' },
              { icon: MdCalendarToday, label: 'Member Since',value: formatDate(user?.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="text-gray-500 dark:text-gray-400 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Edit form */
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">Edit Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Full Name</label>
                <input type="text" className={inp(!!errors.fullName)}
                  {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Too short' } })} />
                {errors.fullName && <Err>{errors.fullName.message}</Err>}
              </div>
              <div>
                <label className={lbl}>Phone Number</label>
                <input type="tel" className={inp(!!errors.phone)} placeholder="+1 234 567 8900"
                  {...register('phone', {
                    pattern: { value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, message: 'Invalid phone' },
                  })} />
                {errors.phone && <Err>{errors.phone.message}</Err>}
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdLock className="text-lg text-blue-600" /> Change Password
              <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} placeholder="Current password"
                    className={`${inp(!!errors.currentPassword)} pr-10`}
                    {...register('currentPassword')} />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={lbl}>New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} placeholder="New password (min 8 chars)"
                    className={`${inp(!!errors.newPassword)} pr-10`}
                    {...register('newPassword', {
                      minLength: { value: 8, message: 'At least 8 characters' },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Needs upper, lower, number' },
                    })} />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                  </button>
                </div>
                {errors.newPassword && <Err>{errors.newPassword.message}</Err>}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const Err = ({ children }) => <p className="mt-1 text-xs text-red-600 dark:text-red-400">{children}</p>;
const inp = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border transition-colors
   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
   placeholder-gray-400 dark:placeholder-gray-500
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   ${hasError ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`;

export default Profile;
