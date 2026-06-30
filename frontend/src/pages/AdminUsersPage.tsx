import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser, toggleUserStatus } from '../services/admin.service.js';
import { FiTrash2, FiUsers, FiPower } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the user: ${name}? This action is permanent.`)) {
      try {
        const response = await deleteUser(id);
        if (response.success) {
          toast.success('User deleted successfully');
          fetchUsers();
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to delete user';
        toast.error(msg);
      }
    }
  };

  const handleToggleStatus = async (id, name, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} the user: ${name}?`)) {
      try {
        const response = await toggleUserStatus(id);
        if (response.success) {
          toast.success(response.message || `User status updated successfully`);
          fetchUsers();
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to update user status';
        toast.error(msg);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <FiUsers className="w-8 h-8 text-violet-600" />
          <span>Manage Users</span>
        </h2>
        <p className="text-sm text-slate-450 mt-1">
          Review, analyze, activate/deactivate, and remove registered customer/worker accounts.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800/80">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Active Roles</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {users.map((item) => (
                <tr key={item._id} className="hover:bg-slate-950/20 text-slate-300">
                  <td className="px-6 py-4 font-bold text-slate-150">{item.name}</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{item.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {item.roles.map((r) => (
                        <span key={r} className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-800 border border-slate-700/50 uppercase tracking-wider text-slate-350">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-450 border-red-500/20'
                    }`}>
                      {item.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5 h-full">
                    <button
                      onClick={() => handleToggleStatus(item._id, item.name, item.isActive !== false)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isActive !== false
                          ? 'hover:bg-amber-500/10 text-amber-500 hover:text-amber-400'
                          : 'hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400'
                      }`}
                      title={item.isActive !== false ? "Deactivate User" : "Activate User"}
                    >
                      <FiPower className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                      title="Delete User Account"
                    >
                      <FiTrash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
