import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { getWorkerProfileById } from '../services/worker.service.js';
import { createReview, getReviewsForWorker } from '../services/review.service.js';
import { createConversation } from '../services/chat.service.js';
import StarRating from '../components/StarRating';
import WorkerProfileSidebar from '../components/WorkerProfileSidebar';
import WorkerReviews from '../components/WorkerReviews';

export default function WorkerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { onlineUsers } = useSelector((state) => state.auth);
  
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a review');
      return navigate('/login');
    }

    if (!comment.trim()) {
      return toast.error('Please enter a comment');
    }

    setSubmittingReview(true);
    try {
      const response = await createReview(worker._id, rating, comment);
      if (response.success) {
        toast.success('Thank you for your review!');
        setComment('');
        setRating(5);
        // Refresh rating info
        await fetchWorkerData();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to post review';
      toast.error(msg);
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

  if (!worker) return null;

  const workerName = worker.userId?.name || 'Skilled Worker';
  const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
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
        <WorkerReviews
          reviews={reviews}
          isSelf={isSelf}
          handleReviewSubmit={handleReviewSubmit}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          submittingReview={submittingReview}
        />
      </div>
    </div>
  );
}
