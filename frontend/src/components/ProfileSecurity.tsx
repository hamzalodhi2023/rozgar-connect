import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormContext } from 'react-hook-form';

export default function ProfileSecurity() {
  const { register, formState: { errors } } = useFormContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            {...register('currentPassword')}
            className={`w-full pl-11 pr-11 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
              errors.currentPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
          >
            {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword?.message as string}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            {...register('newPassword')}
            className={`w-full pl-11 pr-11 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
              errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
          >
            {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword?.message as string}</p>}
      </div>
    </div>
  );
}
