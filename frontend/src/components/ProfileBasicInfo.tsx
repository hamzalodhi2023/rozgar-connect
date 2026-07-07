import React from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import { useFormContext } from 'react-hook-form';

export default function ProfileBasicInfo({ user, email }: any) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      {/* Name */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Full Name
        </label>
        <div className="relative flex items-center">
          <FiUser className="absolute left-3.5 text-slate-500 w-5 h-5" />
          <input
            type="text"
            {...register('name')}
            className={`w-full pl-11 pr-4 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
            }`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name?.message as string}</p>}
      </div>

      {/* Email (Read Only) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Email Address (Cannot be changed)
        </label>
        <div className="relative flex items-center">
          <FiMail className="absolute left-3.5 text-slate-500 w-5 h-5" />
          <input
            type="email"
            readOnly
            value={email}
            className="w-full pl-11 pr-4 py-3 bg-slate-950/10 border border-slate-900 rounded-xl text-sm font-medium text-slate-500 focus:outline-none select-none cursor-not-allowed"
          />
        </div>
      </div>

      {/* Account Roles Label */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Active Account Roles
        </label>
        <div className="flex flex-wrap gap-2">
          {user?.roles.map((role: any) => (
            <span
              key={role}
              className="px-3 py-1 bg-slate-950/40 border border-slate-850 text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
