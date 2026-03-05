'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="top-right" toastOptions={{
    duration: 3000,
    style: { background: '#fff', color: '#1f2937', borderRadius: '1rem', padding: '12px 16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', fontSize: '14px' },
    success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
    error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
  }} />;
}
// TODO: add auto-dismiss with configurable duration
