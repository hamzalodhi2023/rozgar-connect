import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full mb-6">
        <FiAlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none"
      >
        Go back home
      </Link>
    </div>
  );
}
