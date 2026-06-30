import React from 'react';
import ChatBubble from './ChatBubble';
import { FiSend, FiMessageSquare, FiInfo } from 'react-icons/fi';

export default function ChatWindow({
  user,
  activeConversation,
  messages,
  isRecipientTyping,
  messagesEndRef,
  messageText,
  handleInputChange,
  handleSendMessage,
  dispatch,
  setActiveConversation,
  getRecipientName,
  getRecipientRoleLabel
}: any) {
  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950 ${!activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'
      }`}>
      {activeConversation ? (
        <>
          {/* Active Recipient Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => dispatch(setActiveConversation(null))}
                className="md:hidden p-1.5 text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg mr-1"
              >
                Back
              </button>
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {getRecipientName(activeConversation).charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-slate-150 leading-tight">
                  {getRecipientName(activeConversation)}
                </h4>
                <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                  {getRecipientRoleLabel(activeConversation)}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/20 dark:bg-slate-900/5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                <FiInfo className="w-8 h-8 mb-2" />
                <p className="text-xs font-semibold">Start the conversation by typing below</p>
              </div>
            ) : (
              messages.map((message: any) => {
                const isOwn = message.senderId === user.id || message.senderId?._id === user.id;
                return (
                  <ChatBubble
                    key={message._id}
                    message={message}
                    isOwnMessage={isOwn}
                  />
                );
              })
            )}

            {/* Typing indicator */}
            {isRecipientTyping && (
              <div className="flex items-center space-x-2 mb-4 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {getRecipientName(activeConversation).charAt(0).toUpperCase()}
                </div>
                <div className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-750 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
                  <span className="flex space-x-1 items-center pt-1.5">
                    <span className="w-1 h-1 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-850 flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageText}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-violet-550 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm font-medium text-slate-850 dark:text-slate-100 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-3 bg-linear-to-tr from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow transition-all focus:outline-none disabled:opacity-50 flex items-center justify-center"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </>
      ) : (
        <div className="text-center p-8 flex flex-col items-center space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">
            <FiMessageSquare className="w-12 h-12" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Your Chat Box is Empty
          </h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 max-w-xs">
            Select a thread from the conversations list to view message logs, or explore workers profiles to start a chat session.
          </p>
        </div>
      )}
    </div>
  );
}
