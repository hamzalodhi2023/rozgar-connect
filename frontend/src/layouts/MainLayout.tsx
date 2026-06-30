import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Dynamic Header Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Rozgar Connect
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Connecting customers with local skilled professionals.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="text-xs text-slate-450 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Rozgar Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
