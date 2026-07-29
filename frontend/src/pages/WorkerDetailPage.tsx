import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import type { RootState } from '../redux/store';
import { getWorkerProfileById } from '../services/worker.service.js';
import { getReviewsForWorker } from '../services/review.service.js';
import { createConversation } from '../services/chat.service.js';
import { createJob } from '../services/job.service.js';
import StarRating from '../components/StarRating';
import WorkerProfileSidebar from '../components/WorkerProfileSidebar';
import WorkerReviews from '../components/WorkerReviews';

export default function WorkerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hire modal states
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [submittingJob, setSubmittingJob] = useState(false);

  const fetchWorkerData = async () => {
    try {
      const workerResponse = await getWorkerProfileById(id);
      setWorker(workerResponse.data.profile);

      const reviewsResponse = await getReviewsForWorker(id);
      setReviews(reviewsResponse.data.reviews);
    } catch (error) {
      toast.error('Failed to load worker details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const handleChatNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to chat with workers');
      return navigate('/login');
    }

    try {
      const recipientId = worker.userId._id;
      const response = await createConversation(recipientId);
      if (response.success) {
        navigate('/chat');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to start chat session';
      toast.error(msg);
    }
  };

  const handleHireWorker = async (e: any) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to hire workers');
      return navigate('/login');
    }

    if (!jobDescription.trim()) {
      return toast.error('Please describe the job');
    }

    setSubmittingJob(true);
    try {
      const response = await createJob({ workerId: worker.userId._id, description: jobDescription });
      if (response.success) {
        toast.success('Job request sent successfully!');
        setIsHireModalOpen(false);
        setJobDescription('');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to send job request';
      toast.error(msg);
    } finally {
      setSubmittingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!worker) return null;

  const workerName = worker.userId?.name || 'Skilled Worker';
  const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const backendUrl = import.meta.env.VITE_SOCKET_URL || `http://${HOST}:5000`;
  const photoUrl = worker.photo ? (worker.photo.startsWith('http') ? worker.photo : `${backendUrl}${worker.photo}`) : null;

  // Check if current user is the worker themselves
  const isSelf = user?.id === worker.userId?._id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <WorkerProfileSidebar
        worker={worker}
        workerName={workerName}
        photoUrl={photoUrl}
        onlineUsers={onlineUsers}
        isSelf={isSelf}
        handleChatNow={handleChatNow}
        openHireModal={() => {
          if (!isAuthenticated) {
            toast.error('Please sign in to hire workers');
            navigate('/login');
            return;
          }
          setIsHireModalOpen(true);
        }}
      />

      {/* Profile Details & Reviews List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Description Details */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-800/60 pb-2">
            About Me / Services Offered
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {worker.description}
          </p>
        </div>

        {/* Rating and Reviews */}
        <WorkerReviews reviews={reviews} />
      </div>

      {/* Hire Modal */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Request a Job</h2>
            <form onSubmit={handleHireWorker} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Describe what you need help with:
                </label>
                <textarea
                  required
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="E.g., I need my kitchen sink pipe fixed..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-violet-550 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsHireModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submittingJob ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
