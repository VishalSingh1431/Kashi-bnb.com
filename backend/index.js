import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';

const app = express();

// Essential middleware
app.use(cookieParser());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Security middleware
app.use(limiter);

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});