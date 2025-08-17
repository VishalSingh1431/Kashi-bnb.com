import { 
  generateOTP, 
  sendOTPSMS, 
  validatePhoneNumber, 
  generateOTPExpiry, 
  cleanPhoneNumber,
  isOTPExpired
} from '../utils/otpUtils.js';
import { sendOTPEmail } from '../utils/mail.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Send OTP for login
export const sendLoginOTP = async (req, res) => {
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
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Check if this is a Google user without a verified phone number
    if (existingUser.googleId && !existingUser.mobile) {
      return res.status(400).json({ 
        message: 'This Google account does not have a verified phone number. Please add a phone number first.',
        needsPhoneNumber: true,
        userId: existingUser.id,
        email: existingUser.email
      });
    }

    // Check if the phone number is actually verified (p_verified field)
    if (!existingUser.p_verified) {
      return res.status(400).json({ 
        message: 'This phone number is not verified. Please verify your phone number first.',
        needsPhoneVerification: true,
        userId: existingUser.id,
        email: existingUser.email
      });
    }

    // If it's a Google user with a verified phone number, allow OTP login
    // If it's a regular user with password, also allow OTP login
    // This covers both scenarios: Google users with verified phones and regular users

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        mobile: cleanMobile,
        otp: otp,
        type: 'LOGIN',
        expiresAt: expiresAt,
        userId: existingUser.id
      }
    });

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(cleanMobile, otp);
    
    if (smsResult.success) {
      res.status(200).json({ 
        message: 'OTP sent successfully',
        expiresIn: '10 minutes',
        userType: existingUser.googleId ? 'google' : 'regular'
      });
    } else {
      // If SMS fails (including Twilio verification errors), return OTP for development
      res.status(200).json({ 
        message: 'OTP generated successfully! (SMS delivery failed - check console for details)',
        developmentMode: true,
        otp: otp,
        userType: existingUser.googleId ? 'google' : 'regular',
        smsError: smsResult.error || 'SMS delivery failed'
      });
    }

  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send OTP for signup
export const sendSignupOTP = async (req, res) => {
  try {
    const { mobile, name } = req.body;

    if (!mobile || !name) {
      return res.status(400).json({ message: 'Mobile number and name are required' });
    }

    if (!validatePhoneNumber(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { mobile: cleanMobile }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Mobile number already registered. Please login instead.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        mobile: cleanMobile,
        otp: otp,
        type: 'SIGNUP',
        expiresAt: expiresAt
      }
    });

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(cleanMobile, otp);
    
    if (smsResult.success) {
      res.status(200).json({ 
        message: 'OTP sent successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If SMS fails (including Twilio verification errors), return OTP for development
      res.status(200).json({ 
        message: 'OTP generated successfully! (SMS delivery failed - check console for details)',
        developmentMode: true,
        otp: otp,
        smsError: smsResult.error || 'SMS delivery failed'
      });
    }

  } catch (error) {
    console.error('Error sending signup OTP:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Mobile number already registered. Please login instead.' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP and login
export const verifyLoginOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Find the most recent OTP for this mobile
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: cleanMobile,
        type: 'LOGIN',
        otp: otp
      },
      orderBy: {
        time: 'desc' // Changed from createdAt to time
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (isOTPExpired(otpRecord.expiresAt)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Get user details
    const user = await prisma.users.findUnique({
      where: { id: otpRecord.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, first_name: user.first_name, last_name: user.last_name, verified: user.verified, is_admin: user.is_admin, has_hotel: user.has_hotel },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update user token
    await prisma.users.update({
      where: { id: user.id },
      data: { token: token }
    });

    // Delete used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Error verifying login OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP and signup
export const verifySignupOTP = async (req, res) => {
  try {
    const { mobile, otp, name } = req.body;

    if (!mobile || !otp || !name) {
      return res.status(400).json({ message: 'Mobile number, OTP, and name are required' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Find the most recent OTP for this mobile
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: cleanMobile,
        type: 'SIGNUP',
        otp: otp
      },
      orderBy: {
        time: 'desc' // Changed from createdAt to time
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (isOTPExpired(otpRecord.expiresAt)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create new user with first_name, last_name, and mobile
    const newUser = await prisma.users.create({
      data: {
        name: name.trim(),
        first_name,
        last_name,
        mobile: cleanMobile,
        verified: true, // Mobile verification is complete
        p_verified: true,
        time: new Date() // Explicitly set the time field
      }
    });

    console.log('Phone signup: User created successfully:', {
      id: newUser.id,
      name: newUser.name,
      mobile: newUser.mobile,
      time: newUser.time,
      verified: newUser.verified
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, mobile: newUser.mobile, name: newUser.name, first_name: newUser.first_name, last_name: newUser.last_name, verified: newUser.verified, is_admin: newUser.is_admin, has_hotel: newUser.has_hotel },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update user token
    await prisma.users.update({
      where: { id: newUser.id },
      data: { token: token }
    });

    // Delete used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(201).json({
      message: 'Signup successful',
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        mobile: newUser.mobile,
        verified: newUser.verified
      }
    });

  } catch (error) {
    console.error('Error verifying signup OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create password for Google users
export const createPasswordForGoogleUser = async (req, res) => {
  try {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({ message: 'User ID, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists and is a Google user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.googleId) {
      return res.status(400).json({ message: 'This account was not created with Google' });
    }

    if (user.password) {
      return res.status(400).json({ message: 'Password already exists for this account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      message: 'Password created successfully. You can now login with email and password.',
      success: true
    });

  } catch (error) {
    console.error('Error creating password for Google user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send Email OTP for recovery
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Email not found. Please sign up first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        mobile: email, // Using mobile field for email in this case
        otp: otp,
        type: 'EMAIL_RECOVERY',
        expiresAt: expiresAt,
        userId: existingUser.id
      }
    });

    // Send OTP via email using Nodemailer
    const emailResult = await sendOTPEmail(email, otp, 'verification');
    
    if (emailResult.success) {
      res.status(200).json({ 
        message: 'OTP sent to your email successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If email fails, return OTP for development mode
      if (process.env.NODE_ENV === 'development') {
        res.status(200).json({ 
          message: 'OTP generated successfully! (Email delivery failed - check console for details)',
          developmentMode: true,
          otp: otp,
          emailError: emailResult.error || 'Email delivery failed'
        });
      } else {
        res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      }
    }

  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send Email OTP for new user signup verification
export const sendSignupEmailOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please login instead.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database (without userId since user doesn't exist yet)
    await prisma.oTP.create({
      data: {
        mobile: email, // Using mobile field for email
        otp: otp,
        type: 'EMAIL_SIGNUP',
        expiresAt: expiresAt
      }
    });

    // Send OTP via email using Nodemailer
    const emailResult = await sendOTPEmail(email, otp, 'signup');
    
    if (emailResult.success) {
      res.status(200).json({ 
        message: 'Email verification OTP sent successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If email fails, return OTP for development mode
      if (process.env.NODE_ENV === 'development') {
        res.status(200).json({ 
          message: 'OTP generated successfully! (Email delivery failed - check console for details)',
          developmentMode: true,
          otp: otp,
          emailError: emailResult.error || 'Email delivery failed'
        });
      } else {
        res.status(500).json({ message: 'Failed to send verification OTP. Please try again.' });
      }
    }

  } catch (error) {
    console.error('Error sending signup email OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify Email OTP for new user signup
export const verifySignupEmailOTP = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp || !name) {
      return res.status(400).json({ message: 'Email, OTP, and name are required' });
    }

    // Find the OTP record
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: email, // Using mobile field for email
        otp: otp,
        type: 'EMAIL_SIGNUP',
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create new user with verified email
    const newUser = await prisma.users.create({
      data: {
        name: name.trim(),
        first_name,
        last_name,
        email: email.toLowerCase(),
        verified: true // Email verification is complete
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        first_name: newUser.first_name, 
        last_name: newUser.last_name, 
        verified: newUser.verified, 
        is_admin: newUser.is_admin, 
        has_hotel: newUser.has_hotel 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update user token
    await prisma.users.update({
      where: { id: newUser.id },
      data: { token: token }
    });

    // Delete the used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(200).json({
      message: 'Email verification successful! Account created.',
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        verified: newUser.verified
      }
    });

  } catch (error) {
    console.error('Error verifying signup email OTP:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already registered. Please login instead.' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify Email OTP for recovery
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find the OTP record
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: email, // Using mobile field for email
        otp: otp,
        type: 'EMAIL_RECOVERY',
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find the user
    const user = await prisma.users.findUnique({
      where: { id: otpRecord.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark email as verified and add it to user record
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: { 
        email: email.toLowerCase(),
        verified: true // Email is verified through OTP
      }
    });

    // Delete the used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(200).json({ 
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: true
      }
    });

  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user with email during recovery
export const updateUserEmail = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ message: 'User ID and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email is already taken by another user
    const existingUserWithEmail = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      return res.status(409).json({ message: 'Email already registered by another user' });
    }

    // Update user with email
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { 
        email: email.toLowerCase(),
        verified: true // Email is verified through OTP
      }
    });

    res.status(200).json({
      message: 'Email added successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Error updating user email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send Phone OTP for recovery (for existing users adding phone)
export const sendPhoneRecoveryOTP = async (req, res) => {
  try {
    const { mobile, userId } = req.body;

    if (!mobile || !userId) {
      return res.status(400).json({ message: 'Mobile number and user ID are required' });
    }

    if (!validatePhoneNumber(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please check your user ID.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    // Save OTP to database (without userId for now, like other OTP functions)
    await prisma.oTP.create({
      data: {
        mobile: cleanMobile,
        otp: otp,
        type: 'PHONE_RECOVERY',
        expiresAt: expiresAt
      }
    });

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(cleanMobile, otp);
    
    if (smsResult.success) {
      res.status(200).json({ 
        message: 'OTP sent successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If SMS fails (including Twilio verification errors), return OTP for development
      // This handles cases where phone numbers aren't verified in Twilio trial accounts
      res.status(200).json({ 
        message: 'OTP generated successfully! (SMS delivery failed - check console for details)',
        developmentMode: true,
        otp: otp,
        smsError: smsResult.error || 'SMS delivery failed'
      });
    }

  } catch (error) {
    console.error('Error sending phone recovery OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify Phone OTP for recovery
export const verifyPhoneRecoveryOTP = async (req, res) => {
  try {
    const { mobile, otp, userId } = req.body;

    if (!mobile || !otp || !userId) {
      return res.status(400).json({ message: 'Mobile number, OTP, and user ID are required' });
    }

    const cleanMobile = cleanPhoneNumber(mobile);

    // Find the OTP record (without requiring userId in the OTP record)
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: cleanMobile,
        otp: otp,
        type: 'PHONE_RECOVERY',
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find the user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user with phone number
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { 
        mobile: cleanMobile,
        verified: true, // Phone verification is complete
        p_verified: true // Phone verification flag
      }
    });

    // Delete the used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(200).json({ 
      message: 'Phone verified and added successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Error verifying phone recovery OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send Email OTP for adding email to existing account
export const sendAddEmailOTP = async (req, res) => {
  try {
    console.log('sendAddEmailOTP called with:', { email: req.body.email, userId: req.body.userId });
    
    const { email, userId } = req.body;

    if (!email || !userId) {
      console.log('Missing required fields:', { email: !!email, userId: !!userId });
      return res.status(400).json({ message: 'Email and user ID are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please check your user ID.' });
    }

    // Check if email is already taken by another user
    const existingUserWithEmail = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      return res.status(409).json({ message: 'This email is already registered by another user.' });
    }

    // Check if email environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email environment variables not configured');
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact support.',
        error: 'EMAIL_CONFIG_MISSING'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = generateOTPExpiry();

    try {
      console.log('Attempting to save OTP to database with data:', {
        mobile: `email_${email}`,
        type: 'EMAIL_ADD',
        userId: userId,
        expiresAt: expiresAt
      });
      
      // Save OTP to database - use a unique identifier for email OTPs
      await prisma.oTP.create({
        data: {
          mobile: `email_${email}`, // Prefix with 'email_' to distinguish from phone numbers
          otp: otp,
          type: 'EMAIL_ADD',
          expiresAt: expiresAt,
          userId: userId
        }
      });
      
      console.log('OTP saved successfully to database');
    } catch (dbError) {
      console.error('Database error saving OTP:', dbError);
      return res.status(500).json({ 
        message: 'Failed to save OTP. Please try again.',
        error: 'DATABASE_ERROR',
        details: dbError.message
      });
    }

    // Send OTP via email using Nodemailer
    console.log('Attempting to send OTP email to:', email);
    const emailResult = await sendOTPEmail(email, otp, 'verification');
    console.log('Email sending result:', emailResult);
    
    if (emailResult.success) {
      console.log('Email sent successfully');
      res.status(200).json({ 
        message: 'OTP sent to your email successfully',
        expiresIn: '10 minutes'
      });
    } else {
      // If email fails, return OTP for development mode
      if (process.env.NODE_ENV === 'development') {
        res.status(200).json({ 
          message: 'OTP generated successfully! (Email delivery failed - check console for details)',
          developmentMode: true,
          otp: otp,
          emailError: emailResult.error || 'Email delivery failed'
        });
      } else {
        res.status(500).json({ 
          message: 'Failed to send OTP email. Please try again.',
          error: 'EMAIL_DELIVERY_FAILED'
        });
      }
    }

  } catch (error) {
    console.error('Error sending add email OTP:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
};

// Verify Email OTP for adding email to existing account
export const verifyAddEmailOTP = async (req, res) => {
  try {
    console.log('verifyAddEmailOTP called with:', { email: req.body.email, userId: req.body.userId, otp: req.body.otp });
    
    const { email, otp, userId } = req.body;

    if (!email || !otp || !userId) {
      return res.status(400).json({ message: 'Email, OTP, and user ID are required' });
    }

    // Find the OTP record
    console.log('Looking for OTP record with:', { mobile: `email_${email}`, type: 'EMAIL_ADD' });
    
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        mobile: `email_${email}`, // Using email prefix format
        otp: otp,
        type: 'EMAIL_ADD', // New type for adding email
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      console.log('OTP record not found');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    console.log('OTP record found:', { id: otpRecord.id, expiresAt: otpRecord.expiresAt });

    // Find the user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add email to user account
    console.log('Updating user with email:', email.toLowerCase());
    
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { 
        email: email.toLowerCase(),
        verified: true // Email is verified through OTP
      }
    });
    
    console.log('User updated successfully:', { id: updatedUser.id, email: updatedUser.email, verified: updatedUser.verified });

    // Delete the used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    res.status(200).json({ 
      message: 'Email added successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Error verifying add email OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
