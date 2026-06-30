import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiBriefcase,
  FiLayers,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import NavbarDesktopDropdown from './NavbarDesktopDropdown';
import NavbarMobileMenu from './NavbarMobileMenu';

export default function Navbar() {
  const { user, isAuthenticated, logout, becomeWorker } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBecomeWorker = async () => {
    if (window.confirm('Are you sure you want to register as a Worker? You can search jobs and post services.')) {
      await becomeWorker();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Rozgar Connect
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              Find Workers
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `text-sm font-medium flex items-center space-x-1 transition-colors ${isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <FiMessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                </button>

                {showDropdown && (
                  <NavbarDesktopDropdown
                    user={user}
                    setShowDropdown={setShowDropdown}
                    logout={logout}
                    handleBecomeWorker={handleBecomeWorker}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <NavbarMobileMenu
          user={user}
          isAuthenticated={isAuthenticated}
          setIsOpen={setIsOpen}
          handleBecomeWorker={handleBecomeWorker}
          logout={logout}
        />
      )}
    </nav>
  );
}
