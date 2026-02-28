'use client';

import Link from 'next/link';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const reasons = [
  'Insufficient funds in account',
  'Card declined by your bank',
  'Payment session timed out',
  'Network or connectivity issue',
];

export default function PaymentFailurePage() {
  return (
    <div className="flex items-center justify-center min-h-[72vh] animate-fadeInUp px-4">
      <div className="max-w-md w-full">
        <div className="relative">
          {/* Blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative bg-white rounded-3xl border border-red-100 shadow-2xl shadow-red-500/10 overflow-hidden">
            {/* Top color strip */}
            <div className="h-1.5 bg-linear-to-r from-red-400 via-orange-400 to-red-400" />

            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-red-50 to-orange-50 border border-red-100 flex items-center justify-center mx-auto mb-5 shadow-md shadow-red-500/10">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                Something went wrong with your payment. Don't worry — your account has not been charged.
              </p>

              {/* Common reasons */}
              <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 text-left">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">Common Reasons</p>
                <div className="space-y-2">
                  {reasons.map(r => (
                    <div key={r} className="flex items-center gap-2.5 text-sm text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href="/subscription"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-linear-to-r from-red-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all"
                >
                  <RefreshCw className="h-4 w-4" /> Try Again
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-5">
                Need help? Contact us at{' '}
                <span className="text-gray-600 font-medium">support@gotrek.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
