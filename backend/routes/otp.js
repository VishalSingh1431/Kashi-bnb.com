import express from 'express';
import { 
  sendLoginOTP, 
  verifyLoginOTP, 
  sendSignupOTP, 
  verifySignupOTP,
  sendEmailOTP,
  verifyEmailOTP,
  sendSignupEmailOTP,
  verifySignupEmailOTP,
  sendPhoneRecoveryOTP,
  verifyPhoneRecoveryOTP,
  sendAddEmailOTP,
  verifyAddEmailOTP
} from '../controllers/otpController.js';

const router = express.Router();

// Phone OTP routes
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/send-signup-otp', sendSignupOTP);
router.post('/verify-signup-otp', verifySignupOTP);

// Email OTP routes for recovery
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

// Email OTP routes for adding to existing account
router.post('/send-add-email-otp', sendAddEmailOTP);
router.post('/verify-add-email-otp', verifyAddEmailOTP);

// Email OTP routes for new user signup
router.post('/send-signup-email-otp', sendSignupEmailOTP);
router.post('/verify-signup-email-otp', verifySignupEmailOTP);

// Phone recovery OTP routes
router.post('/send-phone-recovery-otp', sendPhoneRecoveryOTP);
router.post('/verify-phone-recovery-otp', verifyPhoneRecoveryOTP);

// Test endpoint for email OTP (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email-otp', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      const testOTP = '123456';
      const emailResult = await sendOTPEmail(email, testOTP, 'verification');
      
      if (emailResult.success) {
        res.json({ message: 'Test email sent successfully', otp: testOTP });
      } else {
        res.status(500).json({ message: 'Failed to send test email', error: emailResult.error });
      }
    } catch (error) {
      res.status(500).json({ message: 'Test failed', error: error.message });
    }
  });
}

export default router;
