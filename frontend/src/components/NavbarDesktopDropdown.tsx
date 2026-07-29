import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiBriefcase, FiLayers, FiLogOut } from 'react-icons/fi';

export default function NavbarDesktopDropdown({ user, setShowDropdown, logout, handleBecomeWorker }: any) {
  return (
    <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden py-1 z-50 transform origin-top-right transition-all animate-fadeIn">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="w-9 h-9 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
        </div>
      </div>

      <div className="p-1 space-y-0.5">
        <Link
          to="/jobs"
          onClick={() => setShowDropdown(false)}
          className="flex items-center px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-all"
        >
          <FiBriefcase className="mr-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
          My Jobs
        </Link>

        <Link
          to="/profile"
          onClick={() => setShowDropdown(false)}
          className="flex items-center px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-all"
        >
          <FiUser className="mr-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
          My Profile
        </Link>

        {user?.roles.includes('worker') ? (
          <Link
            to="/worker-dashboard"
            onClick={() => setShowDropdown(false)}
            className="flex items-center px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-all"
          >
            <FiBriefcase className="mr-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            Worker Dashboard
          </Link>
        ) : (
          <button
            onClick={() => {
              setShowDropdown(false);
              handleBecomeWorker();
            }}
            className="flex w-full items-center text-left px-3 py-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-xl transition-all cursor-pointer"
          >
            <FiBriefcase className="mr-2.5 w-4 h-4 text-violet-500" />
            Become a Worker
          </button>
        )}

        {user?.roles.includes('admin') && (
          <Link
            to="/admin-dashboard"
            onClick={() => setShowDropdown(false)}
            className="flex items-center px-3 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-all"
          >
            <FiLayers className="mr-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="p-1 border-t border-slate-100 dark:border-slate-800/80 mt-1">
        <button
          onClick={() => {
            setShowDropdown(false);
            logout();
          }}
          className="flex w-full items-center text-left px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
        >
          <FiLogOut className="mr-2.5 w-4 h-4 text-red-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
