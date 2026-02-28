'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Bot, Send, User, Lock, Sparkles, Crown, CheckCircle, Mountain, Map, Shield } from 'lucide-react';

interface Msg { role: 'user' | 'bot'; text: string; }

const proFeatures = [
  { icon: Mountain, label: 'Trail recommendations & info' },
  { icon: Map,      label: 'Route planning & tips' },
  { icon: Shield,   label: 'Safety & gear advice' },
  { icon: Sparkles, label: 'Personalized trek planning' },
];

const suggestions = [
  'Best trails for beginners?',
  'What gear do I need?',
  'Everest Base Camp tips',
  'Best season to trek Annapurna',
];

export default function ChatbotPage() {
  const { user } = useAuth();
  const hasAccess = user?.subscription === 'Pro' || user?.subscription === 'Premium' || user?.role === 'admin';

  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: "Hi! I'm TrailMate, your AI trekking assistant. Ask me anything about trails, gear, safety, or planning your next adventure!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await api.post('/v1/chatbot/query', { query: q });
      const botReply = res.data?.data?.response || res.data?.response || "I couldn't process that. Try again!";
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (err: any) {
      const msg = err?.response?.status === 403
        ? 'This feature requires a Pro or Premium subscription. Please upgrade to continue.'
        : 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, { role: 'bot', text: msg }]);
    }
    setLoading(false);
  };

  /* ── Locked / Upgrade state ── */
  if (!hasAccess) {
    return (
      <div className="space-y-5 animate-fadeInUp max-w-2xl mx-auto">
        {/* Header */}
        <div className="relative bg-linear-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-cyan-500/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TrailMate AI</h1>
              <p className="text-cyan-100 text-xs mt-0.5">Your personal trekking assistant</p>
            </div>
          </div>
        </div>

        {/* Upgrade card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-linear-to-br from-amber-50 to-orange-50 border-b border-amber-100 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="h-7 w-7 text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Pro Feature</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              TrailMate AI is available for Pro and Premium subscribers.
            </p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-xs font-semibold text-amber-700">
              <Crown className="h-3 w-3" /> Your Plan: {user?.subscription || 'Basic'}
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">What you'll get with Pro</p>
            <div className="space-y-2.5 mb-5">
              {proFeatures.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-cyan-600" />
                  </div>
                  <span className="text-sm text-gray-700">{label}</span>
                  <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
                </div>
              ))}
            </div>
            <Link
              href="/subscription"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
            >
              <Sparkles className="h-4 w-4" /> Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Chat UI ── */
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto animate-fadeInUp">

      {/* Header */}
      <div className="relative bg-linear-to-br from-cyan-600 to-blue-600 rounded-2xl p-5 text-white overflow-hidden shadow-xl shadow-cyan-500/20 mb-4 shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">TrailMate AI</h1>
              <p className="text-cyan-100 text-xs mt-0.5">Your personal trekking assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-cyan-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-cyan-600" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === 'user'
                  ? 'bg-linear-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions (only when 1 message) */}
        {messages.length === 1 && (
          <div className="px-4 pb-3">
            <p className="text-[11px] text-gray-400 font-medium mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about trails, gear, safety..."
              className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-11 w-11 rounded-xl bg-linear-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-all disabled:opacity-40 shadow-md shadow-cyan-500/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
