'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight, Sparkles, Bot, Users, ListChecks } from 'lucide-react';

const unlocked = [
  { icon: Bot,       label: 'TrailMate AI Assistant' },
  { icon: Users,     label: 'Create Trekking Groups' },
  { icon: ListChecks,label: 'AI Checklist Generator' },
  { icon: Sparkles,  label: 'Advanced Analytics' },
];

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[72vh] animate-fadeInUp px-4">
      <div className="max-w-md w-full">
        <div className="relative">
          {/* Blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            {/* Top color strip */}
            <div className="h-1.5 bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400" />

            <div className="p-8 text-center">
              {/* Icon */}
              <div className="relative inline-flex mb-5">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shadow-md shadow-emerald-500/10">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-linear-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                Your subscription is now active. Welcome to the GoTrek premium experience!
              </p>

              {/* Features unlocked */}
              <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Features Unlocked
                </p>
                <div className="space-y-2.5">
                  {unlocked.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-emerald-800">{label}</span>
                      <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/subscription"
                  className="flex items-center justify-center w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  View Subscription Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
