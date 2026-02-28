import express from 'express';
import authRoutes from '../routers/auth.routers';
import trailRoutes from '../routers/trail.routers';
import userRoutes from '../routers/admin/user.routes';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/trail', trailRoutes);
app.use('/api/user', userRoutes);

export default app;
