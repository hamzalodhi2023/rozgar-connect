import React from 'react';
import { FiLock } from 'react-icons/fi';

export default function ProfileSecurity({ currentPassword, setCurrentPassword, newPassword, setNewPassword }: any) {
  return (
    <div className="pt-6 border-t border-slate-800/60 space-y-4">
      <h3 className="text-sm font-bold text-slate-200 border-b border-slate-805/10 pb-2">
        Change Password (Optional)
      </h3>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Current Password
        </label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
          <input
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
