import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAllWorkerProfiles,
  deleteWorkerProfile,
  verifyWorker,
  rejectWorker,
} from '../services/admin.service.js';
import { FiTrash2, FiBriefcase, FiMapPin, FiStar, FiEye, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification Modal State
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWorkers = async () => {
    try {
      const response = await getAllWorkerProfiles();
      if (response.success) {
        setWorkers(response.data.workers);
      }
    } catch (error) {
      toast.error('Failed to load worker profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove the worker profile for: ${name}? The user's role will be demoted to Customer.`
      )
    ) {
      try {
        const response = await deleteWorkerProfile(id);
        if (response.success) {
          toast.success('Worker profile deleted successfully');
          fetchWorkers();
        }
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to delete profile';
        toast.error(msg);
      }
    }
  };

  const handleVerify = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await verifyWorker(id);
      if (response.success) {
        toast.success('Worker profile verified successfully!');
        fetchWorkers();
        setShowModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify worker');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await rejectWorker(id);
      if (response.success) {
        toast.success('Worker verification rejected');
        fetchWorkers();
        setShowModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject verification');
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (worker: any) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-450 border border-slate-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Unverified
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const backendUrl = import.meta.env.VITE_SOCKET_URL || `http://${HOST}:5000`;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FiBriefcase className="w-8 h-8 text-violet-600" />
          <span>Manage Worker Profiles</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review details of registered workers, check locations, ratings, verify ID cards, and moderate profiles.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Worker Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Reviews Count</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {workers.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span>{item.userId?.name || 'Skilled Worker'}</span>
                      {item.isVerified && (
                        <FiCheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" title="Verified Worker" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{item.categories?.join(', ') || 'General Worker'}</td>
                  <td className="px-6 py-4 capitalize">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {item.area}, {item.city}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.verificationStatus || 'unverified')}</td>
                  <td className="px-6 py-4 font-semibold text-amber-500">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.averageRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.reviewCount}</td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {(item.idCardFront || item.idCardBack) && (
                      <button
                        onClick={() => openReviewModal(item)}
                        className="p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 transition-colors"
                        title="Review Verification Docs"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id, item.userId?.name)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors"
                      title="Remove Worker Profile"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Documents Glass Modal */}
      {showModal && selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-4xl w-full max-w-3xl shadow-xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Review Identity Verification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Worker: {selectedWorker.userId?.name || 'Worker'} | Email: {selectedWorker.userId?.email || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Document Previews */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
              {/* ID Front */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-center">ID Card Front</span>
                <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden aspect-video bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                  {selectedWorker.idCardFront ? (
                    <img
                      src={`${backendUrl}${selectedWorker.idCardFront}`}
                      alt="ID Front"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Photo Uploaded</span>
                  )}
                </div>
              </div>

              {/* ID Back */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-center">ID Card Back</span>
                <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden aspect-video bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                  {selectedWorker.idCardBack ? (
                    <img
                      src={`${backendUrl}${selectedWorker.idCardBack}`}
                      alt="ID Back"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Photo Uploaded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
                className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedWorker._id)}
                disabled={actionLoading}
                className="px-4.5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center gap-1.5"
              >
                <FiX className="w-4 h-4" />
                Reject Verification
              </button>
              <button
                onClick={() => handleVerify(selectedWorker._id)}
                disabled={actionLoading}
                className="px-4.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
              >
                <FiCheck className="w-4 h-4" />
                Verify Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
