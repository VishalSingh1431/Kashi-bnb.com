import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // Add this import
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Your Vite/React frontend
    'https://kashibnb.com'   // Your production domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware before other middleware
app.use(cors(corsOptions));

// Essential middleware
app.use(cookieParser());
app.use(express.json({ limit: '5000mb' })); // Increased to 50000MB
app.use(express.urlencoded({ limit: '5000mb', extended: true })); // Increased to 50000MB

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Security middleware
// app.use(limiter);

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';
  
  res.status(500).json({
    success: false,
    message: errorMessage
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});