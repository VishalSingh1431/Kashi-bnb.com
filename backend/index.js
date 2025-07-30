// MUST BE THE ABSOLUTE FIRST LINE IN YOUR ENTRY FILE
import 'dotenv/config'; // Modern ES6 way to load .env

import express from 'express';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import hotelRouter from './routes/hotel.js';
import paymentRouter from './routes/payments.js';
import cors from 'cors';

// Debug: Verify variables are loaded
// console.log('ImageKit Public Key exists:', !!process.env.IMG_K_PRK);

const app = express();
// app.use(cors()); // for local development
// for production
app.use(cors({
    origin: 'https://kashibnb.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

app.get('/', (req, res) => res.send("APIs for Kashi-BnB"));

app.listen(443, () => console.log("Server running on port 443"));