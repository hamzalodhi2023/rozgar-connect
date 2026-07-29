import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.js';
import StarRating from './StarRating.jsx';
import { FiMapPin, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function WorkerCard({ worker }) {
  const { _id, userId, categories = [], city, area, phone, whatsapp, averageRating, reviewCount, photo } = worker;
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  
  const workerName = userId?.name || 'Skilled Worker';
  const workerUserId = userId?._id || userId;
  const isOnline = onlineUsers?.includes(workerUserId);
  
  const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  let backendUrl = import.meta.env.VITE_SOCKET_URL || `http://${HOST}:5000`;
  if (backendUrl === '/') backendUrl = ''; // Fix double slash for proxy
  const photoUrl = photo ? (photo.startsWith('http') ? photo : `${backendUrl}${photo}`) : null;

  return (
    <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] hover:-translate-y-1 hover:border-violet-500/40 hover:bg-slate-850/80 transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={workerName}
                className="w-14 h-14 rounded-full object-cover border border-slate-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {workerName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-slate-900 bg-emerald-500 animate-pulse" title="Online" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-150 group-hover:text-violet-400 transition-colors flex items-center gap-1">
              <span>{workerName}</span>
              {worker.isVerified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <svg className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <title>Verified Worker</title>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <span key={idx} className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-450 border border-violet-500/20 capitalize">
                    {cat}
                  </span>
                ))
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 capitalize">
                  General Worker
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Location & Rating */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-400">
            <FiMapPin className="w-4 h-4 mr-1 text-slate-500 shrink-0" />
            <span className="capitalize">{area}, {city}</span>
          </div>

          <div className="flex items-center space-x-2">
            <StarRating rating={averageRating} size={14} />
            <span className="text-xs font-semibold text-slate-350">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-end gap-2">
        <Link
          to={`/workers/${_id}`}
          className="flex items-center px-4 py-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all space-x-1"
        >
          <span>View Details</span>
          <FiMessageSquare className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
