import 'dotenv/config';
import express from 'express';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';
import cors from 'cors';

const app = express();

// Production CORS configuration
const allowedOrigins = [
  'https://kashibnb.com',
  'https://www.kashibnb.com'
];

// Enhanced CORS options
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'], // Expose custom headers if needed
  credentials: true,
  optionsSuccessStatus: 204 // Proper status for OPTIONS requests
};

// Apply CORS middleware
app.use(cors(corsOptions));

// No need for separate app.options('*') handler when using cors(corsOptions)

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path} | Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
app.use(limiter);

// API routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Cross-origin request blocked'
    });
  }

  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🛡️  Allowed CORS origins:', allowedOrigins);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});