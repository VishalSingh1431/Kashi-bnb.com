import express from 'express';
import {
  sendResetPasswordOTP,
  sendResetPasswordEmail,
  resetPasswordWithOTP,
  resetPasswordWithToken
} from '../controllers/forgotPasswordController.js';

const router = express.Router();

// Send reset password OTP via mobile
router.post('/send-mobile-otp', sendResetPasswordOTP);

// Send reset password email
router.post('/send-email', sendResetPasswordEmail);

// Reset password with mobile OTP
router.post('/reset-with-otp', resetPasswordWithOTP);

// Reset password with email token
router.post('/reset-with-token', resetPasswordWithToken);

export default router;
