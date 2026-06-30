import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarMobileMenu({ user, isAuthenticated, setIsOpen, handleBecomeWorker, logout }: any) {
  return (
    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 pt-2 pb-4 space-y-1 shadow-lg">
      <Link
        to="/"
        onClick={() => setIsOpen(false)}
        className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Home
      </Link>
      <Link
        to="/search"
        onClick={() => setIsOpen(false)}
        className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Find Workers
      </Link>
      {isAuthenticated && (
        <Link
          to="/chat"
          onClick={() => setIsOpen(false)}
          className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Chat
        </Link>
      )}

      {isAuthenticated ? (
        <div className="pt-4 border-t border-slate-250 dark:border-slate-800 space-y-1">
          <div className="px-3 py-2 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-850 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            My Profile
          </Link>

          {user?.roles.includes('worker') ? (
            <Link
              to="/worker-dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Worker Dashboard
            </Link>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                handleBecomeWorker();
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-violet-600 dark:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Become a Worker
            </button>
          )}

          {user?.roles.includes('admin') && (
            <Link
              to="/admin-dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 px-3">
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex justify-center items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
