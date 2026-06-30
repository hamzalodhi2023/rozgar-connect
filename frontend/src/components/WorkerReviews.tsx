import React from 'react';
import StarRating from './StarRating';
import { FiUser } from 'react-icons/fi';

export default function WorkerReviews({
  reviews, isSelf, handleReviewSubmit, rating, setRating, comment, setComment, submittingReview
}: any) {
  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-205 border-b border-slate-800/60 pb-2">
        Customer Reviews ({reviews.length})
      </h2>

      {/* Review form (Only for customers and if not self) */}
      {!isSelf && (
        <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-200">
            Rate this worker
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-semibold mr-2">Select Rating:</span>
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={(newVal: any) => setRating(newVal)}
              size={20}
            />
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience hiring this worker..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-violet-550 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all focus:outline-none disabled:opacity-50"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No reviews yet. Be the first to write a review.
          </div>
        ) : (
          reviews.map((rev: any) => (
            <div key={rev._id} className="p-4 bg-slate-950/25 border border-slate-900 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
                    {rev.customerId?.name?.charAt(0) || <FiUser className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {rev.customerId?.name || 'Customer'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center">
                <StarRating rating={rev.rating} size={12} />
              </div>

              <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
