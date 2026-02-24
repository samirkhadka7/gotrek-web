'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5050';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user?._id) return;

    const newSocket = io(SOCKET_URL, { auth: { token } });

    newSocket.on('connect', () => {
      newSocket.emit('register', user._id);
    });

    setSocket(newSocket);
    return () => { newSocket.close(); };
  }, [user?._id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() { return useContext(SocketContext); }
