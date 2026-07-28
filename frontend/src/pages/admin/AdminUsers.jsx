// ============================================================
// pages/admin/AdminUsers.jsx
// List all registered applicants with search and pagination
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdPeople, MdVisibility, MdSearch } from 'react-icons/md';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePagination from '../../hooks/usePagination';
import { formatDate, getFileUrl, getInitials } from '../../utils/helpers';

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const pagination = usePagination(total);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers({
        search: search || undefined,
        page:   pagination.page,
        limit:  pagination.limit,
      });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search, pagination.page, pagination.limit]); // eslint-disable-line

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (val) => { setSearch(val); pagination.reset(); };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Applicants</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total} registered applicant{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <SearchBar placeholder="Search by name, email, or username..." onSearch={handleSearch} className="w-full max-w-md" />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Loading users..." /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <MdPeople className="text-6xl text-gray-300 dark:text-gray-600 mb-3" />
          <p className="font-medium text-gray-500 dark:text-gray-400">No applicants found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-800/50
            text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <div className="col-span-5">User</div>
            <div className="col-span-2 text-center">Username</div>
            <div className="col-span-2 text-center">Applications</div>
            <div className="col-span-2 text-center">Joined</div>
            <div className="col-span-1 text-center">View</div>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {users.map((user) => (
              <div key={user._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-5 py-4
                  hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                {/* User */}
                <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                  {user.profilePicture ? (
                    <img src={getFileUrl(user.profilePicture)} alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center
                      text-white text-sm font-bold flex-shrink-0">
                      {getInitials(user.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="md:col-span-2 flex items-center md:justify-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</span>
                </div>

                {/* App count */}
                <div className="md:col-span-2 flex items-center md:justify-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                    ${user.applicationCount > 0
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                    {user.applicationCount}
                  </span>
                </div>

                {/* Joined */}
                <div className="md:col-span-2 flex items-center md:justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</span>
                </div>

                {/* Action */}
                <div className="md:col-span-1 flex items-center md:justify-center">
                  <Link to={`/admin/users/${user._id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                      hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                    title="View Profile">
                    <MdVisibility className="text-base" />
                  </Link>
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
    </div>
  );
};

export default AdminUsers;
