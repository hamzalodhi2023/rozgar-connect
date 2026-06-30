import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

export default function ChatSidebar({ conversations, loading, activeConversation, dispatch, setActiveConversation, getRecipientName, getRecipientRoleLabel }: any) {
  return (
    <div className={`w-full md:w-80 flex flex-col border-r border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 ${activeConversation ? 'hidden md:flex' : 'flex'
      }`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-850">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <FiMessageSquare className="w-5 h-5 text-violet-600" />
          <span>Conversations</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
        {loading && conversations.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-8 text-slate-400 dark:text-slate-500 text-sm">
            No conversations found. Browse workers to start a chat.
          </div>
        ) : (
          conversations.map((chat: any) => {
            const isActive = activeConversation?._id === chat._id;
            const rName = getRecipientName(chat);
            const rRole = getRecipientRoleLabel(chat);

            return (
              <button
                key={chat._id}
                onClick={() => dispatch(setActiveConversation(chat))}
                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center space-x-3 transition-colors ${isActive ? 'bg-violet-50/50 dark:bg-violet-950/20 border-l-4 border-violet-600' : ''
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {rName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-805 dark:text-slate-150 truncate">{rName}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded capitalize">{rRole}</span>
                  </div>
                  <p className="text-xs text-slate-405 dark:text-slate-400 mt-1 truncate">
                    {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
