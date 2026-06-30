import React from 'react';

export default function ChatBubble({ message, isOwnMessage }) {
  const { content, createdAt, senderId } = message;
  
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col mb-4 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm transition-all duration-200 ${
        isOwnMessage
          ? 'bg-linear-to-tr from-violet-600 to-indigo-600 text-white rounded-br-none'
          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-750 rounded-bl-none'
      }`}>
        {/* Message Content */}
        <p className="whitespace-pre-wrap leading-relaxed break-words">{content}</p>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1.5 flex justify-end font-semibold ${
          isOwnMessage ? 'text-violet-250/80' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
