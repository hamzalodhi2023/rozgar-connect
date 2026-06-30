import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <span className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Rozgar Connect
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
