import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus } from '../redux/slices/jobSlice';
import { RootState, AppDispatch } from '../redux/store';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { createReview } from '../services/review.service';
import CustomerJobDetails from '../components/CustomerJobDetails';

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { jobs, loading } = useSelector((state: RootState) => state.jobs);
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState<'all' | 'given' | 'received'>('all');

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleStatusUpdate = async (jobId: string, status: string) => {
    try {
      await dispatch(updateJobStatus({ jobId, status })).unwrap();
      toast.success(`Job status updated to ${status}`);
      
      // Automatically prompt for review when customer completes the job
      if (status === 'completed') {
        const jobToReview = jobs.find(j => j._id === jobId);
        if (jobToReview) {
          setSelectedJob(jobToReview);
          setReviewModalOpen(true);
        }
      }
    } catch (error: any) {
      toast.error(error || 'Failed to update job status');
    }
  };

  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please enter a comment');
    }

    setSubmittingReview(true);
    try {
      const response = await createReview(selectedJob._id, rating, comment);
      if (response.success) {
        toast.success('Review submitted successfully!');
        setReviewModalOpen(false);
        setComment('');
        setRating(5);
        dispatch(fetchJobs());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    if (jobTypeFilter === 'all') return true;
    const isCustomer = job.customerId._id === user?.id;
    if (jobTypeFilter === 'given') return isCustomer;
    if (jobTypeFilter === 'received') return !isCustomer;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-100">My Jobs</h1>
        
        {/* Filter Buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setJobTypeFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              jobTypeFilter === 'all' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setJobTypeFilter('given')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              jobTypeFilter === 'given' 
                ? 'bg-violet-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            Jobs Given
          </button>
          <button
            onClick={() => setJobTypeFilter('received')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              jobTypeFilter === 'received' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            Jobs Received
          </button>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
          No jobs found for this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => {
            const role = job.customerId._id === user?.id ? 'customer' : 'worker';
            const otherParty = role === 'customer' ? job.workerId : job.customerId;

            return (
              <div key={job._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        role === 'customer' 
                          ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {role === 'customer' ? 'Job Given (Hiring)' : 'Job Received (Working)'}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize border ${
                        job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        job.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        job.status === 'rejected' || job.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        Status: {job.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">
                      {role === 'customer' ? `Job with Worker: ${otherParty?.name}` : `Job from Customer: ${otherParty?.name}`}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 whitespace-pre-wrap">{job.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {role === 'worker' && job.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(job._id, 'accepted')} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold text-xs rounded-xl transition-all">Accept</button>
                        <button onClick={() => handleStatusUpdate(job._id, 'rejected')} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold text-xs rounded-xl transition-all">Reject</button>
                      </>
                    )}
                    {role === 'worker' && job.status === 'accepted' && (
                      <button onClick={() => handleStatusUpdate(job._id, 'in-progress')} className="px-4 py-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 font-bold text-xs rounded-xl transition-all">Start Job</button>
                    )}
                    {role === 'worker' && job.status === 'in-progress' && (
                      <button onClick={() => handleStatusUpdate(job._id, 'worker-completed')} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-bold text-xs rounded-xl transition-all">Mark Completed</button>
                    )}
                    {role === 'customer' && job.status === 'worker-completed' && (
                      <button onClick={() => handleStatusUpdate(job._id, 'completed')} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold text-xs rounded-xl transition-all">Confirm Completion</button>
                    )}
                    {role === 'customer' && job.status === 'completed' && !job.isReviewed && (
                      <button onClick={() => { setSelectedJob(job); setReviewModalOpen(true); }} className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-bold text-xs rounded-xl transition-all">Write Review</button>
                    )}
                  </div>
                </div>
                
                {/* Extra Details for Customer */}
                {role === 'customer' && ['accepted', 'in-progress', 'worker-completed', 'completed'].includes(job.status) && (
                  <CustomerJobDetails job={job} />
                )}
              </div>
            );
        })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Review Worker</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-violet-550 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-violet-550 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
