'use client';

import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import ToastProvider from '@/components/ui/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
        <ToastProvider />
      </SocketProvider>
    </AuthProvider>
  );
}
// TODO: add error boundary provider
