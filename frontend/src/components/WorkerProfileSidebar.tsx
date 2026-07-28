import React from 'react';
import StarRating from './StarRating';
import { FiPhone, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function WorkerProfileSidebar({ worker, workerName, photoUrl, onlineUsers, isSelf, handleChatNow }: any) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-slate-900 border border-slate-800/60 rounded-3xl p-6 shadow-sm text-center">
        <div className="relative inline-block mx-auto shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={workerName}
              className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-violet-550 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-4xl mx-auto shadow">
              {workerName.charAt(0).toUpperCase()}
            </div>
          )}
          {onlineUsers?.includes(worker?.userId?._id || worker?.userId) && (
            <span className="absolute bottom-1 right-1 block h-5 w-5 rounded-full ring-4 ring-slate-900 bg-emerald-500 animate-pulse" title="Online" />
          )}
        </div>

        <h1 className="text-xl font-extrabold text-slate-100 mt-4 leading-tight">
          {workerName}
        </h1>
        {worker.isVerified && (
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <title>Verified Worker</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified</span>
            </span>
          </div>
        )}

        {worker.verificationStatus === 'rejected' && (
          <div className="mt-3 p-3 bg-red-950/25 border border-red-900/40 rounded-2xl text-left max-w-xs mx-auto">
            <p className="text-xs font-extrabold text-red-450 flex items-center gap-1.5 mb-1 justify-center sm:justify-start">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Verification Rejected</span>
            </p>
            <p className="text-[10px] text-slate-350 leading-normal text-center sm:text-left">
              Your ID card verification has been rejected by the admin. {isSelf && "Please update your profile details and re-submit your documents."}
            </p>
          </div>
        )}

        {worker.verificationStatus === 'pending' && (
          <div className="mt-3 p-3 bg-amber-950/25 border border-amber-900/40 rounded-2xl text-left max-w-xs mx-auto">
            <p className="text-xs font-extrabold text-amber-450 flex items-center gap-1.5 mb-1 justify-center sm:justify-start">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.8 2.8a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Verification Pending</span>
            </p>
            <p className="text-[10px] text-slate-350 leading-normal text-center sm:text-left">
              His/Her documents are under review by our admin team. We will notify you once verified.
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {worker.categories && worker.categories.map((cat: string, index: number) => (
            <span key={index} className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-450 border border-violet-500/20 capitalize">
              {cat}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center text-sm text-slate-400">
          <FiMapPin className="w-4 h-4 mr-1 text-slate-500" />
          <span className="capitalize">{worker.area}, {worker.city}</span>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center space-x-1">
            <StarRating rating={worker.averageRating} size={18} />
            <span className="text-sm font-bold text-slate-205 ml-1">
              {worker.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-slate-500">({worker.reviewCount} total reviews)</span>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {!isSelf && (
            <button
              onClick={handleChatNow}
              className="w-full py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2"
            >
              <FiMessageSquare className="w-5 h-5" />
              <span>Chat Now</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
