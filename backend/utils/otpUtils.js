import twilio from 'twilio';
import crypto from 'crypto';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a random 4-digit OTP (alternative)
export const generateShortOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP via SMS using Twilio
export const sendOTPSMS = async (phoneNumber, otp, message = null) => {
  try {
    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio not configured, skipping SMS send');
      return { success: false, error: 'Twilio not configured', note: 'SMS not sent - Twilio not configured' };
    }

    // Validate Twilio phone number format
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhone.startsWith('+')) {
      console.error('Invalid Twilio phone number format. Must start with +');
      return { success: false, error: 'Invalid Twilio phone number configuration' };
    }

    console.log('Twilio Configuration:', {
      accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Missing',
      authToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Missing',
      phoneNumber: twilioPhone
    });

    const defaultMessage = `🏛️ KashiBNB Verification Code: ${otp}\n\nValid for 10 minutes.\n\nBest regards,\nTeam KashiBNB`;
    const smsMessage = message || defaultMessage;

    // Clean and format phone number for India (+91)
    let formattedPhone = phoneNumber;
    
    // Remove all non-digits first
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    
    // If it's already 13 digits and starts with 91, it's already formatted
    if (cleanDigits.length === 13 && cleanDigits.startsWith('91')) {
      formattedPhone = `+${cleanDigits}`;
    }
    // If it's 10 digits, add +91 prefix
    else if (cleanDigits.length === 10) {
      formattedPhone = `+91${cleanDigits}`;
    }
    // If it's 11 digits and starts with 0, remove 0 and add +91
    else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
      formattedPhone = `+91${cleanDigits.substring(1)}`;
    }
    // If it's 12 digits and starts with 91, add + prefix
    else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
      formattedPhone = `+${cleanDigits}`;
    }
    else {
      // Default: assume it's a 10-digit number and add +91
      formattedPhone = `+91${cleanDigits}`;
    }

    console.log(`Original: ${phoneNumber}, Cleaned: ${cleanDigits}, Formatted: ${formattedPhone}`);

    const result = await twilioClient.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    return {
      success: true,
      messageId: result.sid,
      note: 'SMS sent successfully'
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    console.error('Twilio Error Details:', {
      code: error.code,
      message: error.message,
      status: error.status,
      moreInfo: error.moreInfo,
      details: error.details
    });
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.status
    };
  }
};

// Validate phone number format (Indian)
export const validatePhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Indian format: 10 digits starting with 6-9
  if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
    return true;
  }
  
  // International format with +91: 13 digits (e.g., +919876543210)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('91') && /^91[6-9]/.test(cleanPhone)) {
    return true;
  }
  
  return false;
};

// Check if OTP is expired
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

// Generate OTP expiration time (10 minutes from now)
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Clean phone number (remove +91, spaces, etc.)
export const cleanPhoneNumber = (phone) => {
  return phone.replace(/[^0-9]/g, '');
};

// Rate limiting for OTP requests
export const checkOTPRateLimit = async (prisma, phone, type) => {
  try {
    const recentOTPs = await prisma.oTP.findMany({
      where: {
        mobile: cleanPhoneNumber(phone), // Changed from 'phone' to 'mobile'
        type: type,
        time: { // Changed from 'createdAt' to 'time'
          gte: new Date(Date.now() - 2 * 60 * 1000) // Last 2 minutes (increased from 1 minute)
        }
      }
    });

    if (recentOTPs.length > 0) {
      return false; // Rate limit exceeded
    }
    return true;
  } catch (error) {
    console.error('Rate limiting check failed:', error);
    // In case of database error, allow OTP (fail open for safety)
    return true;
  }
};
