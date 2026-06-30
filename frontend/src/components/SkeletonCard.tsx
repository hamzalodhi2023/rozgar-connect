import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4 animate-pulse-slow">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        </div>
      </div>

      {/* Location Skeleton */}
      <div className="space-y-2 py-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      </div>

      {/* Footer Skeleton */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24" />
      </div>
    </div>
  );
}
