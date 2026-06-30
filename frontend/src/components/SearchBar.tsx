import React, { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiSliders, FiChevronDown } from 'react-icons/fi';
import { getCategories } from '../services/category.service.js';

const DEFAULT_CATEGORIES = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'ac technician',
  'mechanic',
  'gardener',
  'cleaner',
];

export default function SearchBar({ onSearch }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data.categories?.length > 0) {
          setCategories(response.data.categories.map((c: any) => c.name));
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (error) {
        setCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      category: category || undefined,
      city: city || undefined,
      area: area || undefined,
      sortBy,
    });
  };

  const handleReset = () => {
    setCategory('');
    setCity('');
    setArea('');
    setSortBy('newest');
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-slate-900 border border-slate-800/60 p-4 md:p-6 rounded-2xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Field */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Looking For
          </label>
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all capitalize appearance-none"
            >
              <option value="">All Services</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 pointer-events-none text-slate-400 flex items-center">
              <FiChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* City Field */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            City
          </label>
          <div className="relative flex items-center">
            <FiMapPin className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="e.g. Islamabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Search Button / Filters Toggle */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium focus:outline-none transition-all flex items-center gap-2"
          >
            <FiSliders className="w-5 h-5" />
            <span>Filters</span>
          </button>

          <button
            type="submit"
            className="flex-1 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <FiSearch className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          {/* Area Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Area/Neighborhood
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
          </div>

          {/* Sort By Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Sort By
            </label>
            <div className="relative flex items-center w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all appearance-none"
              >
                <option value="newest">Newest Workers</option>
                <option value="highestRating">Highest Rating</option>
                <option value="mostReviews">Most Reviews</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-slate-400 flex items-center">
                <FiChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all focus:outline-none"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
