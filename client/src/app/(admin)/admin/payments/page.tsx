'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Payment } from '@/types';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import { CreditCard, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    adminService.getPayments()
      .then(res => {
        const data = res.data?.data?.payments || res.data?.payments || res.data?.data || [];
        setPayments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(payments.length / perPage);
  const paginated  = payments.slice((page - 1) * perPage, page * perPage);

  const success = payments.filter(p => p.status === 'success');
  const failed  = payments.filter(p => p.status === 'failure');
  const pending = payments.filter(p => p.status === 'pending');
  const revenue = success.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-amber-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-amber-100 text-sm mt-1">{payments.length} transactions — Rs. {revenue.toLocaleString()} total revenue</p>
        </div>
      </div>

      {/* ── Revenue Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Rs. ${revenue.toLocaleString()}`, icon: TrendingUp,  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
          { label: 'Successful',    value: success.length,                   icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Failed',        value: failed.length,                    icon: XCircle,     color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100' },
          { label: 'Pending',       value: pending.length,                   icon: Clock,       color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-4 border ${s.border} flex items-center gap-3 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No payments found</td></tr>
              )}
              {paginated.map(p => {
                const userName = typeof p.userId === 'object' ? (p.userId as any).name : p.userId;
                return (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <CreditCard className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{userName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={p.plan === 'Premium' ? 'warning' : 'info'}>{p.plan || '—'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">Rs. {p.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={p.status === 'success' ? 'success' : p.status === 'failure' ? 'danger' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400 max-w-[140px] truncate">{p.transaction_uuid || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(p.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
