import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth.js';

export default function HomeHero() {
  const { isAuthenticated, user, becomeWorker, loading } = useAuth();
  const navigate = useNavigate();

  const handleBecomeWorkerClick = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/register?role=worker');
      return;
    }

    if (user?.roles?.includes('worker')) {
      navigate('/worker-dashboard');
      return;
    }

    await becomeWorker();
  };

  return (
    <section className="relative rounded-3xl overflow-hidden bg-linear-to-tr from-violet-600 to-indigo-700 text-white py-12 md:py-16 px-6 md:px-12 shadow-xl">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Find Skilled Local Workers for Any Job
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-xl font-medium leading-relaxed">
            Rozgar Connect matches you with verified electricians, plumbers, carpenters, painters, and more in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/search"
              className="px-6 py-3.5 bg-white text-violet-700 hover:bg-slate-100 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Find a Worker Now</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleBecomeWorkerClick}
              disabled={loading}
              className="px-6 py-3.5 border border-indigo-300 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Become a Worker'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 w-full h-64 sm:h-80 lg:h-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
          <img
            src="/header.jpg"
            alt="Find Skilled Local Workers"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(99,102,241,0.4),transparent)] pointer-events-none" />
    </section>
  );
}
