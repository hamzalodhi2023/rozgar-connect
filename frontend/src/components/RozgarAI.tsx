import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiLoader } from 'react-icons/fi';
import { sendAIMessage } from '../services/ai.service.js';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function RozgarAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am Rozgar AI, the official assistant for Rozgar Connect. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Add user message to local React state
    const userMessage: Message = {
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Call backend AI API
    const replyText = await sendAIMessage(userText);

    // Add AI reply to state
    const aiMessage: Message = {
      sender: 'ai',
      text: replyText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed z-50 p-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer shadow-violet-500/20 ${isDashboard ? 'bottom-24 right-6' : 'bottom-6 right-6'
            }`}
          title="Chat with Rozgar AI"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <FiCpu className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </button>
      )}

      {/* Responsive Chat Box */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out] transition-all">

          {/* Header */}
          <div className="p-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <FiCpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Rozgar AI</h3>
                <span className="text-[10px] text-violet-200 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1"></span>
                  Official Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close chat"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.2s_ease-out]`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs ${isUser
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-150 dark:border-slate-850 rounded-bl-none'
                      }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${isUser ? 'text-violet-200' : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl rounded-bl-none shadow-xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-[bounce_1.4s_infinite_100ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-[bounce_1.4s_infinite_200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-[bounce_1.4s_infinite_300ms]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-150 dark:border-slate-850 bg-white dark:bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Rozgar AI..."
              maxLength={500}
              disabled={isLoading}
              className="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl text-sm text-slate-800 dark:text-slate-200 transition-all placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-violet-600 cursor-pointer shadow-xs shadow-violet-500/10"
              title="Send message"
            >
              {isLoading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiSend className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
