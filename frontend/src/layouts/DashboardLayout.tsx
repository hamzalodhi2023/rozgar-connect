import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../components/Navbar.jsx';
import {
  FiBriefcase,
  FiUser,
  FiGrid,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiUsers,
  FiStar,
  FiMapPin,
} from 'react-icons/fi';

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial value on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if it is Admin or Worker Dashboard
  const isAdmin = location.pathname.startsWith('/admin-dashboard');

  const workerLinks = [
    { name: 'Overview', path: '/worker-dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'My Chat Room', path: '/chat', icon: <FiMessageSquare className="w-5 h-5" /> },
    { name: 'Worker Profile', path: '/worker-setup', icon: <FiBriefcase className="w-5 h-5" /> },
    { name: 'Account Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { name: 'Admin Stats', path: '/admin-dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Manage Users', path: '/admin-dashboard/users', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Manage Workers', path: '/admin-dashboard/workers', icon: <FiBriefcase className="w-5 h-5" /> },
    { name: 'Manage Reviews', path: '/admin-dashboard/reviews', icon: <FiStar className="w-5 h-5" /> },
    { name: 'Manage Categories', path: '/admin-dashboard/categories', icon: <FiLayers className="w-5 h-5" /> },
    { name: 'Manage Locations', path: '/admin-dashboard/locations', icon: <FiMapPin className="w-5 h-5" /> },
  ];

  const currentLinks = isAdmin ? adminLinks : workerLinks;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-20 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-850 flex flex-col transition-all duration-300 z-30 
            fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)]
            ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0 md:w-20'}
          `}
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
            <span className={`font-semibold text-slate-800 dark:text-slate-200 text-sm truncate ${!sidebarOpen && 'md:hidden'}`}>
              {isAdmin ? 'Admin Console' : 'Worker Console'}
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {sidebarOpen ? <FiChevronLeft className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2">
            {currentLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-colors duration-300 group ${
                    isActive
                      ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-300'
                  }`
                }
              >
                <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                <span className={`ml-3 transition-opacity duration-300 truncate ${!sidebarOpen ? 'opacity-0 w-0 h-0 overflow-hidden md:hidden' : 'opacity-100'}`}>
                  {link.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

        {/* Floating trigger on mobile when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-30 p-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-750 hover:to-indigo-750 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-violet-500/30"
            title="Open Dashboard Menu"
          >
            <FiGrid className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
