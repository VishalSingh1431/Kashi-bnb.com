import { PrismaClient } from '@prisma/client';
import { 
  generateOTP, 
  sendOTPSMS, 
  validatePhoneNumber, 
  generateOTPExpiry, 
  cleanPhoneNumber
} from '../utils/otpUtils.js';
import { sendEmail } from '../utils/mail.js';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Get frontend URL without relying on NODE_ENV
const getFrontendURL = () => {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
};

// Send reset password OTP via mobile
export const sendResetPasswordOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    if (!validatePhoneNumber(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { mobile: cleanMobile }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found with this mobile number' });
    }

    // Check if user is a Google OAuth user (they can't reset password via mobile OTP)
    if (existingUser.googleId) {
      return res.status(400).json({ 
        message: 'This account was created with Google. Please use Google login instead.' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        phone: cleanMobile,
        otp: otp,
        type: 'RESET',
        expiresAt: expiresAt,
        userId: existingUser.id
      }
    });

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(cleanMobile, otp);
    
    if (smsResult.success) {
      res.status(200).json({ 
        message: 'Reset password OTP sent successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If SMS fails (including Twilio verification errors), return OTP for development
      res.status(200).json({ 
        message: 'Reset password OTP generated successfully! (SMS delivery failed - check console for details)',
        developmentMode: true,
        otp: otp,
        smsError: smsResult.error || 'SMS delivery failed'
      });
    }

  } catch (error) {
    console.error('Error sending reset password OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check if user is a Google OAuth user (they can't reset password via email)
    if (existingUser.googleId) {
      return res.status(400).json({ 
        message: 'This account was created with Google. Please use Google login instead.' 
      });
    }

    // Generate reset token
    const resetToken = cryptoRandomString({ length: 32 });
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save reset token to database
    await prisma.users.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
      }
    });

    // Send reset email
    const resetLink = `${getFrontendURL()}/reset-password?token=${resetToken}&email=${email}`;
    
    const emailResult = await sendEmail(
      email, 
      resetToken, 
      'reset-password',
      resetLink
    );

    if (emailResult.success) {
      res.status(200).json({ 
        message: 'Reset password email sent successfully',
        expiresIn: '24 hours'
      });
    } else {
      res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }

  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset password with mobile OTP
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({ message: 'Mobile, OTP and new password are required' });
    }

    if (!validatePhoneNumber(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Find OTP record
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        phone: cleanMobile,
        otp: otp,
        type: 'RESET'
      },
      include: {
        user: true
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { id: otpRecord.id } });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.users.update({
      where: { id: otpRecord.userId },
      data: { password: hashedPassword }
    });

    // Delete OTP record
    await prisma.oTP.delete({ where: { id: otpRecord.id } });

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Error resetting password with OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset password with email token
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: 'Token, email and new password are required' });
    }

    // Find user with reset token
    const user = await prisma.users.findFirst({
      where: {
        email: email,
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Error resetting password with token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
