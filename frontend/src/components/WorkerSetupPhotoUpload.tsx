import React from 'react';
import { FiCamera } from 'react-icons/fi';

export default function WorkerSetupPhotoUpload({ photoPreview, handlePhotoChange }: any) {
  return (
    <div className="flex flex-col items-center space-y-4 pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="relative group">
        <div className="absolute inset-0 bg-violet-400 dark:bg-violet-600 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Profile Preview"
            className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative w-32 h-32 rounded-full bg-slate-50 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-inner transition-all duration-300 group-hover:border-violet-400 dark:group-hover:border-violet-500 group-hover:bg-violet-50/50 dark:group-hover:bg-violet-900/10 group-hover:text-violet-500">
            <FiCamera className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
        <label className="absolute bottom-1 right-1 p-3 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-full cursor-pointer shadow-lg hover:shadow-violet-500/30 hover:scale-110 transition-all duration-300 ring-4 ring-white dark:ring-slate-800 z-10">
          <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
          <FiCamera className="w-5 h-5" />
        </label>
      </div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
        Upload Profile Photo <span className="opacity-70 font-normal">(Optional, max 5MB)</span>
      </span>
    </div>
  );
}
