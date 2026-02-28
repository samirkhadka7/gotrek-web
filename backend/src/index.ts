import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import passport from 'passport';
import './utils/OAuth'; // Import OAuth configuration
import trailRoutes from './routers/trail.routers';
import authRoutes from './routers/auth.routers';
import groupRoutes from './routers/group.routers';
import userRoutes from './routers/admin/user.routes';
import messageRoutes from './routers/message.routes';
import chatbotRoutes from './routers/chatbot.routes';
import analyticsRoutes from './routers/analytics.router';
import activityRoutes from './routers/activity.router';
import stepRoutes from './routers/step.router';
import path from 'path';
import cors from 'cors';
import Message from './models/message.model';
import bodyParser from 'body-parser';
import paymentRoutes from './routers/payment.router';
import checklistRoutes from './routers/checklist';
import { checkSubscriptionStatus } from './middlewares/subscription.middleware';
import subscriptionRoutes from './routers/subscription.routes';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './types/socket';
import { initializeSocket, registerUserSocket, removeUserSocket } from './utils/socket';
import notificationRoutes from './routers/notification.routers';

console.log('Application starting...');

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initializeSocket(io);

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
console.log('Middleware for JSON, body-parser, and static file serving has been set up.');

// Apply middleware to all routes
app.use('/api', checkSubscriptionStatus);
app.use('/api/subscription', subscriptionRoutes);
console.log('Subscription middleware and routes have been configured.');

// API Routes
app.use('/api/trail', trailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/step', stepRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('API routes have been configured.');

// Socket.IO
io.on('connection', (socket) => {
  let registeredUserId: string | null = null;

  socket.on('register', (userId: string) => {
    registeredUserId = userId;
    registerUserSocket(userId, socket.id);
  });

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
  });

  socket.on('leaveGroup', (groupId) => {
    socket.leave(groupId);
  });

  socket.on('sendMessage', async ({ groupId, senderId, text }) => {
    try {
      const newMessage = new Message({
        group: groupId,
        sender: senderId,
        text: text,
      });
      const savedMessage = await newMessage.save();
      const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'name profileImage');
      io.to(groupId).emit('newMessage', populatedMessage as any);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('messageError', { message: 'Could not send message.' });
    }
  });

  socket.on('disconnect', () => {
    if (registeredUserId) {
      removeUserSocket(registeredUserId, socket.id);
    }
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
