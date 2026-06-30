import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No results found', message = 'Try expanding your search parameters or check back later.', actionLabel = null, onAction = null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full mb-4">
        <FiInbox className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-450 dark:text-slate-400 max-w-sm mb-6">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all focus:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
