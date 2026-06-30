import React from 'react';
import { FiSettings } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm transition-all">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <FiSettings className="w-8 h-8 text-violet-600" />
          <span>System Settings</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adjust visual display theme configurations and account defaults.
        </p>
      </div>

      <div className="space-y-6">


        {/* System parameters stub */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Notifications
            </h3>
            <p className="text-xs text-slate-455 dark:text-slate-455">
              Receive alert notifications for chat responses.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded">
            Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
