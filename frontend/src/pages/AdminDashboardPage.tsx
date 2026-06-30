import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminStats } from '../services/admin.service.js';
import { FiUsers, FiBriefcase, FiStar, FiGrid, FiTrendingUp } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        if (response.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Admin Dashboard Overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Marketplace stats auditor, moderation controls, and system summary details.
        </p>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] hover:-translate-y-1 hover:border-indigo-500/40 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Total Registrants</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalUsers}</h3>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <FiUsers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Workers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] hover:-translate-y-1 hover:border-violet-500/40 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-violet-400 transition-colors">Registered Workers</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalWorkers}</h3>
          </div>
          <div className="p-4 bg-violet-50 dark:bg-violet-500/10 text-violet-400 rounded-2xl group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <FiBriefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] hover:-translate-y-1 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-500 transition-colors">Total Reviews</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalReviews}</h3>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-inner">
            <FiStar className="w-6 h-6 group-hover:fill-white fill-amber-400 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Role Distribution Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <FiTrendingUp className="w-5 h-5 text-violet-600" />
          <span>Role Breakdowns</span>
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Customers</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats?.customersCount}</h4>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Workers</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats?.workersCount}</h4>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Admins</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats?.adminsCount}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
