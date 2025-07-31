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
    origin: ['https://kashibnb.com', 'https://www.kashibnb.com', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// Debug middleware to log CORS-related requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/payments', paymentRouter);

app.get('/', (req, res) => res.send("APIs for Kashi-BnB"));

app.listen(6000, () => console.log("Server running on port 6000"));