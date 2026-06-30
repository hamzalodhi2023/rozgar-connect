import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllReviews, deleteReview, updateReview } from '../services/admin.service.js';
import StarRating from '../components/StarRating.jsx';
import { 
  FiTrash2, 
  FiStar, 
  FiInfo, 
  FiEdit2, 
  FiX, 
  FiSearch, 
  FiFilter, 
  FiUser, 
  FiBriefcase, 
  FiCalendar, 
  FiAlertCircle, 
  FiTrendingUp 
} from 'react-icons/fi';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Edit Review Modal States
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews();
      if (response.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      toast.error('Failed to load reviews list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review? Worker rating averages will be updated.')) {
      try {
        const response = await deleteReview(id);
        if (response.success) {
          toast.success('Review deleted successfully');
          fetchReviews();
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to delete review';
        toast.error(msg);
      }
    }
  };

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editComment.trim()) {
      return toast.error('Comment is required');
    }
    setSubmitting(true);
    try {
      const response = await updateReview(editingReview._id, editRating, editComment);
      if (response.success) {
        toast.success('Review updated successfully');
        setEditingReview(null);
        fetchReviews();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update review';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Live filtering
  const filteredReviews = reviews.filter((item) => {
    const customerName = (item.customerId?.name || '').toLowerCase();
    const workerName = (item.workerId?.userId?.name || '').toLowerCase();
    const commentText = (item.comment || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = customerName.includes(query) || workerName.includes(query) || commentText.includes(query);
    const matchesRating = ratingFilter === 'all' || item.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  // Calculate live statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
    : 0;
  const criticalReviews = reviews.filter((r) => r.rating <= 2).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-10">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FiStar className="w-8 h-8 text-violet-600" />
            <span>Manage Reviews</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze customer feedback, monitor aggregate rating trends, and edit/moderate review entries.
          </p>
        </div>
      </div>

      {/* Stats cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Reviews Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Feedback</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{totalReviews}</h3>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl">
            <FiTrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">{avgRating.toFixed(1)}</h3>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">/ 5.0</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
            <FiStar className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Critical Ratings Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Critical Reviews (1-2★)</span>
            <h3 className={`text-2xl md:text-3xl font-extrabold ${criticalReviews > 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{criticalReviews}</h3>
          </div>
          <div className={`p-3 rounded-xl ${criticalReviews > 0 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'}`}>
            <FiAlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer name, worker, or review content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Rating Filter Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <FiFilter className="w-4 h-4" />
            <span>Filter Rating:</span>
          </span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full md:w-44 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews feed grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center">
          <FiInfo className="w-10 h-10 mb-3 text-slate-400" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-350">No reviews found matching the criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((item) => (
            <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs hover:shadow-[0_8px_30px_rgba(139,92,246,0.06)] hover:-translate-y-1 hover:border-violet-500/35 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                {/* Header: Customer Name and Rating badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                      {(item.customerId?.name || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-none">
                        {item.customerId?.name || 'Customer'}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{item.customerId?.email || 'No email registered'}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {item.rating} ★
                  </span>
                </div>

                {/* Connection: Reviewed worker */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-450 border-t border-slate-50 dark:border-slate-850/60 pt-3">
                  <FiUser className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-400">Review for:</span>
                  <span className="bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md font-bold text-violet-500 dark:text-violet-400 truncate max-w-[150px]">
                    {item.workerId?.userId?.name || 'Skilled Worker'}
                  </span>
                </div>

                {/* Comment box bubble */}
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 p-4 rounded-2xl text-slate-650 dark:text-slate-300 text-xs italic relative">
                  "{item.comment}"
                </div>
              </div>

              {/* Footer: Date and action controls */}
              <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-850/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 text-slate-500 dark:text-slate-400 hover:text-violet-650 dark:hover:text-violet-450 transition-colors cursor-pointer"
                    title="Edit Feedback"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-500 dark:text-slate-400 hover:text-rose-650 dark:hover:text-rose-450 transition-colors cursor-pointer"
                    title="Delete Feedback"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Review Content</h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-all cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Reviewer</label>
                  <input
                    type="text"
                    disabled
                    value={editingReview.customerId?.name || 'Customer'}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Worker Name</label>
                  <input
                    type="text"
                    disabled
                    value={editingReview.workerId?.userId?.name || 'Skilled Worker'}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Rating Score</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Below Average)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Feedback Comment</label>
                <textarea
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter review comment..."
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
