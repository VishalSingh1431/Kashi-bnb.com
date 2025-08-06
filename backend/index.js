import 'dotenv/config';
import express from 'express';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';

const app = express();

// Remove ALL CORS middleware - Nginx will handle it
app.use(express.json());

// Debug middleware only
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Rate limiting
app.use(limiter);

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(3000, () => console.log('API running on port 3000'));