import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchWorkers } from '../services/worker.service.js';
import WorkerCard from '../components/WorkerCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { FiSearch, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import HomeHero from '../components/HomeHero';
import HomeCategories from '../components/HomeCategories';

export default function HomePage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const response = await searchWorkers({ sortBy: 'highestRating' });
        setWorkers(response.data.workers.slice(0, 4)); // Show top 4
      } catch (error) {
        console.error('Error fetching top workers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopWorkers();
  }, []);

  return (
    <div className="space-y-16">
      <HomeHero />
      <HomeCategories />

      {/* Why Choose Us */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-200 dark:border-slate-800">
        <div className="flex items-start space-x-4">
          <FiCheckCircle className="w-8 h-8 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Local & Instant</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Search and sort verified workers directly based in your local city and residential neighborhood.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FiCheckCircle className="w-8 h-8 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">In-App Messaging</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Message workers directly through our secure internal chat system to arrange services.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FiCheckCircle className="w-8 h-8 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Reviews & Ratings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Browse transparent customer ratings and reviews to pick the highest quality skilled professional.</p>
          </div>
        </div>
      </section>

      {/* Top Rated Workers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-850 dark:text-slate-100">
              Top Rated Local Professionals
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top rated workers currently active in the marketplace.
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-750 flex items-center space-x-1"
          >
            <span>See All</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-450 text-sm font-medium">No workers registered in the platform yet.</p>
            <Link to="/register?role=worker" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline text-sm inline-block mt-2">
              Be the first worker to sign up!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
