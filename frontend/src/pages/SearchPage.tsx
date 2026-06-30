import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchWorkers } from '../services/worker.service.js';
import SearchBar from '../components/SearchBar.jsx';
import WorkerCard from '../components/WorkerCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL search params
  const categoryParam = searchParams.get('category') || '';
  const cityParam = searchParams.get('city') || '';
  const areaParam = searchParams.get('area') || '';
  const sortByParam = searchParams.get('sortBy') || 'newest';

  const fetchWorkersList = async (filters) => {
    setLoading(true);
    try {
      const response = await searchWorkers(filters);
      if (response.success) {
        setWorkers(response.data.workers);
      }
    } catch (error) {
      console.error('Failed to search workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on initial mount or when query parameters change
    fetchWorkersList({
      category: categoryParam || undefined,
      city: cityParam || undefined,
      area: areaParam || undefined,
      sortBy: sortByParam,
    });
  }, [categoryParam, cityParam, areaParam, sortByParam]);

  const handleSearchSubmit = (newFilters) => {
    // Update search query params
    const updatedParams = {};
    if (newFilters.category) updatedParams.category = newFilters.category;
    if (newFilters.city) updatedParams.city = newFilters.city;
    if (newFilters.area) updatedParams.area = newFilters.area;
    if (newFilters.sortBy) updatedParams.sortBy = newFilters.sortBy;

    setSearchParams(updatedParams);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
          Find Local Professionals
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Search and filter profiles to find the best skilled workers.
        </p>
      </div>

      {/* Interactive Search Panel */}
      <SearchBar onSearch={handleSearchSubmit} />

      {/* Results grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse-slow">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <EmptyState
          title="No workers found"
          message="We couldn't find any professionals matching your search parameters. Try expanding filters."
          actionLabel="Reset All Filters"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
}
