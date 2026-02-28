import { Server } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

let io: IOServer;

// Maps userId -> Set of socketIds (user may have multiple tabs open)
const userSocketMap = new Map<string, Set<string>>();

export function initializeSocket(socketServer: IOServer) {
  io = socketServer;
}

export function getIO(): IOServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function registerUserSocket(userId: string, socketId: string) {
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId)!.add(socketId);
}

export function removeUserSocket(userId: string, socketId: string) {
  const sockets = userSocketMap.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) userSocketMap.delete(userId);
  }
}

export function emitToUser(userId: string, event: string, data: any) {
  const sockets = userSocketMap.get(userId);
  if (sockets && io) {
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event as any, data);
    });
  }
}
