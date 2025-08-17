import express from 'express';
import { 
  googleAuth, 
  googleAuthCallback, 
  verifyGoogleIdToken 
} from '../controllers/googleAuthController.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.post('/google/verify-token', verifyGoogleIdToken);

export default router;
