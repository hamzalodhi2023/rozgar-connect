import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyWorkerProfile } from '../services/worker.service.js';
import { getReviewsForWorker } from '../services/review.service.js';
import StarRating from '../components/StarRating.jsx';
import { FiStar, FiMessageSquare, FiTrendingUp, FiEdit2, FiInfo } from 'react-icons/fi';

export default function WorkerDashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const profileRes = await getMyWorkerProfile();
        if (profileRes.success && profileRes.data.profile) {
          setProfile(profileRes.data.profile);

          // Get reviews
          const reviewsRes = await getReviewsForWorker(profileRes.data.profile._id);
          if (reviewsRes.success) {
            setReviews(reviewsRes.data.reviews);
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error('Please complete your worker profile setup first!');
          navigate('/worker-setup');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      {/* Welcome banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-12 bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 rounded-3xl md:rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 md:mb-3">Welcome back, {profile.userId?.name}!</h2>
          <p className="text-indigo-100/90 text-xs md:text-base max-w-lg font-medium leading-relaxed">Manage your service availability, track your ratings, and connect with your customers all in one place.</p>
        </div>
        <Link
          to="/worker-setup"
          className="relative z-10 w-full md:w-auto px-6 py-3.5 bg-white text-indigo-600 hover:bg-slate-50 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group shrink-0"
        >
          <FiEdit2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Verification Status Alerts */}
      {profile.verificationStatus === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 md:p-5 rounded-3xl md:rounded-[2rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 text-red-400 rounded-xl shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base text-red-300">ID Verification Rejected</h4>
              <p className="text-xs md:text-sm text-slate-300 mt-1">Your profile verification documents (ID Card) were rejected by the admin team. Please verify your information and re-upload clear photos of your ID card.</p>
            </div>
          </div>
          <Link
            to="/worker-setup"
            className="w-full sm:w-auto px-5 py-2.5 bg-red-650 hover:bg-red-750 text-white font-bold text-sm rounded-xl shrink-0 transition-colors text-center border border-red-550/40"
          >
            Update Documents
          </Link>
        </div>
      )}

      {profile.verificationStatus === 'pending' && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 md:p-5 rounded-3xl md:rounded-[2rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.8 2.8a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base text-amber-300">ID Verification Pending Review</h4>
              <p className="text-xs md:text-sm text-slate-300 mt-1">We are currently reviewing your submitted ID Card documents. This process usually takes up to 24-48 hours. We appreciate your patience!</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {/* Rating card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 p-5 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-black/10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl md:rounded-2xl ring-4 ring-amber-50/50 dark:ring-amber-500/5 group-hover:scale-110 transition-transform duration-300">
              <FiStar className="w-6 h-6 md:w-7 md:h-7 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Average Rating</span>
              <div className="flex items-end gap-1 mt-0.5 md:mt-1">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
                  {profile.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-semibold mb-0.5">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews count card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 p-5 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-black/10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl md:rounded-2xl ring-4 ring-violet-50/50 dark:ring-violet-500/5 group-hover:scale-110 transition-transform duration-300">
              <FiTrendingUp className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Total Reviews</span>
              <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mt-0.5 md:mt-1 leading-none">
                {profile.reviewCount} <span className="text-sm md:text-base text-slate-400 font-semibold">{profile.reviewCount === 1 ? 'Review' : 'Reviews'}</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Chat shortcut card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 p-5 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-black/10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 group sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-4 h-full">
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl md:rounded-2xl ring-4 ring-indigo-50/50 dark:ring-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
              <FiMessageSquare className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="flex flex-col justify-center h-full">
              <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase mb-1">Client Inbox</span>
              <Link to="/chat" className="inline-flex items-center text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link">
                Open messages <span className="ml-1 group-hover/link:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews feed section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-5 md:p-10 shadow-xl shadow-slate-200/20 dark:shadow-black/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5 md:pb-6 mb-6 md:mb-8">
          <h3 className="text-lg md:text-2xl font-extrabold text-slate-800 dark:text-white">
            Recent Reviews & Ratings
          </h3>
          <span className="self-start sm:self-auto bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
            {reviews.length} {reviews.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="space-y-4 md:space-y-5">
          {reviews.length === 0 ? (
            <div className="text-center py-12 md:py-16 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl md:rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 md:p-5 rounded-full mb-4 md:mb-5 shadow-inner">
                <FiInfo className="w-7 h-7 md:w-8 md:h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 mb-1.5">No reviews yet</p>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xs md:max-w-sm mx-auto px-4">
                When customers review your services, their feedback and ratings will appear here.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 md:p-8 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl md:rounded-[1.5rem] hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 md:mb-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md shrink-0">
                      {(rev.customerId?.name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-white">
                        {rev.customerId?.name || 'Anonymous Customer'}
                      </h4>
                      <div className="flex items-center mt-0.5 md:mt-1">
                        <StarRating rating={rev.rating} size={12} />
                      </div>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="pl-0 sm:pl-14 md:pl-16">
                  <p className="text-slate-600 dark:text-slate-300 text-xs md:text-base leading-relaxed bg-white/50 dark:bg-slate-900/50 p-3 md:p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
