import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch (error) {
      // Handled by hook toasts
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-100">
          Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative flex items-center">
            <FiMail className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative flex items-center">
            <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 mt-2"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
