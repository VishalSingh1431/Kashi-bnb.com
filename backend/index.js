import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';
import adminRouter from './routes/admin.js';
import otpRouter from './routes/otp.js';
import authRouter from './routes/auth.js';
import forgotPasswordRouter from './routes/forgotPassword.js';
import contactRouter from './routes/contact.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Trust NGINX proxy for correct client IPs and secure headers
app.set('trust proxy', 1);

// Essential middleware
app.use(cookieParser());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/otp', otpRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/forgot-password', forgotPasswordRouter);
app.use('/api/v1/contact', contactRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// import 'dotenv/config';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import { limiter } from './middleware/auth.js';
// import userRouter from './routes/user.js';
// import hotelRouter from './routes/hotel.js';
// import paymentRouter from './routes/payments.js';

// const app = express();

// // Essential middleware
// app.use(cookieParser());
// app.use(express.json());

// // Debug middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
//   next();
// });

// // Security middleware
// app.use(limiter);

// // Routes
// app.use('/api/v1/user', userRouter);
// app.use('/api/v1/hotel', hotelRouter);
// app.use('/api/v1/payments', paymentRouter);

// // Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'healthy' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

