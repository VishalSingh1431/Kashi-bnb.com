import { PrismaClient } from '@prisma/client';
import { generateGoogleAuthURL, exchangeCodeForTokens } from '../utils/googleAuth.js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Get frontend URL without relying on NODE_ENV
const getFrontendURL = () => {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
};

// Redirect to Google OAuth
export const googleAuth = async (req, res) => {
  try {
    const { action } = req.query;
    
    // Generate Google OAuth URL with proper error handling
    const authURL = generateGoogleAuthURL(action || 'login');
    
    console.log('Redirecting to Google OAuth:', authURL);
    res.redirect(authURL);
    
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    
    // Check if it's a configuration error
    if (error.message.includes('Missing required Google OAuth environment variables')) {
      return res.status(500).json({ 
        message: 'Google OAuth is not properly configured. Please contact support.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Configuration error'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to initiate Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Handle Google OAuth callback
export const googleAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query; // state contains the action
    const action = state || 'login'; // Default to login if no state
    const isSignup = action === 'signup';

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange code for user info
    const result = await exchangeCodeForTokens(code);
    
    if (!result.success) {
      return res.status(400).json({ message: 'Failed to authenticate with Google' });
    }

    const { googleId, email, name, picture, emailVerified } = result.user;

    // Split name into first and last name
    const nameParts = name ? name.trim().split(' ') : ['', ''];
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || null;

    // Check if user already exists
    let user = await prisma.users.findFirst({
      where: {
        OR: [
          { googleId: googleId },
          { email: email }
        ]
      }
    });

    if (user) {
      // If user already exists with this email and Google ID
      if (user.email === email && user.googleId === googleId) {
        if (isSignup) {
          // User is trying to sign up but account already exists - redirect to login
          const frontendURL = getFrontendURL();
          const redirectURL = `${frontendURL}/login?message=Account already exists. Please login instead.`;
          return res.redirect(redirectURL);
        } else {
          // User is trying to login - proceed with login
          console.log('Existing user logging in with Google:', user.email);
        }
      }
      // If user exists with email but different Google ID, prevent registration
      else if (user.email === email && user.googleId && user.googleId !== googleId) {
        const frontendURL = getFrontendURL();
        const redirectURL = `${frontendURL}/login?message=An account with this email already exists. Please login with your existing account.`;
        return res.redirect(redirectURL);
      }
      // If user exists with different email but same Google ID, prevent registration
      else if (user.googleId === googleId && user.email && user.email !== email) {
        const frontendURL = getFrontendURL();
        const redirectURL = `${frontendURL}/login?message=An account with this Google ID already exists. Please login with your existing account.`;
        return res.redirect(redirectURL);
      }
      // Update existing user with Google ID if not present (linking existing email account)
      else if (!user.googleId) {
        // Check if another user already has this Google ID
        const existingGoogleUser = await prisma.users.findUnique({
          where: { googleId: googleId }
        });
        
        if (existingGoogleUser) {
          const frontendURL = getFrontendURL();
          const redirectURL = `${frontendURL}/login?message=This Google account is already linked to another user.`;
          return res.redirect(redirectURL);
        }
        
        user = await prisma.users.update({
          where: { id: user.id },
          data: { 
            googleId: googleId,
            // If Google confirms email ownership, mark verified
            verified: user.verified || Boolean(emailVerified),
          }
        });
      }
    } else {
      if (isSignup) {
        // Create new user
        user = await prisma.users.create({
          data: {
            name: name,
            first_name,
            last_name,
            email: email,
            googleId: googleId,
            verified: true, // Google users are pre-verified
            p_verified: true
          }
        });
      } else {
        // User is trying to login but account doesn't exist - redirect to signup
        const frontendURL = getFrontendURL();
        const redirectURL = `${frontendURL}/signup?message=Account not found. Please sign up first.`;
        return res.redirect(redirectURL);
      }
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, first_name: user.first_name, last_name: user.last_name, verified: user.verified, is_admin: user.is_admin, has_hotel: user.has_hotel },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Update user token
    await prisma.users.update({
      where: { id: user.id },
      data: { token: token }
    });

    // Redirect to frontend with token and user data
    const frontendURL = getFrontendURL();
    
    if (isSignup && !user.mobile) {
      // For new Google signups without phone, redirect to signup with recovery flow
      const userData = encodeURIComponent(JSON.stringify({
        id: user.id,
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        verified: user.verified,
        is_admin: user.is_admin,
        has_hotel: user.has_hotel
      }));
      const redirectURL = `${frontendURL}/signup?token=${encodeURIComponent(token)}&userData=${userData}`;
      res.redirect(redirectURL);
    } else {
      // For existing users or users with phone, redirect to auth callback
      const userData = encodeURIComponent(JSON.stringify({
        id: user.id,
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        verified: user.verified,
        is_admin: user.is_admin,
        has_hotel: user.has_hotel
      }));
      const redirectURL = `${frontendURL}/auth-callback?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(user.id)}&userData=${userData}`;
      res.redirect(redirectURL);
    }

  } catch (error) {
    console.error('Error in Google auth callback:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// Verify Google ID token (for mobile apps)
export const verifyGoogleIdToken = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the ID token
    const result = await verifyGoogleIdToken(idToken);
    
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid Google ID token' });
    }

    const { googleId, email, name, emailVerified } = result.user;

    // Check if user already exists
    let user = await prisma.users.findFirst({
      where: {
        OR: [
          { googleId: googleId },
          { email: email }
        ]
      }
    });

    // Also check if there's a user with the same email but no Google ID (regular signup)
    if (!user) {
      const existingEmailUser = await prisma.users.findFirst({
        where: { 
          email: email,
          googleId: null
        }
      });
      
      if (existingEmailUser) {
        // If Google confirms email ownership, link the account and mark verified
        if (emailVerified) {
          user = await prisma.users.update({
            where: { id: existingEmailUser.id },
            data: { googleId: googleId, verified: true }
          });
        } else {
          return res.status(409).json({ 
            message: 'An account with this email already exists. Please login with your existing email/password account.' 
          });
        }
      }
    }

    if (user) {
      // If user already exists with this email and Google ID
      if (user.email === email && user.googleId === googleId) {
        // For mobile apps, always treat as login if user exists
        console.log('Existing user logging in with Google:', user.email);
      }
      // If user exists with email but different Google ID, prevent registration
      else if (user.email === email && user.googleId && user.googleId !== googleId) {
        // If Google verifies ownership, link the accounts
        if (emailVerified) {
          user = await prisma.users.update({
            where: { id: user.id },
            data: { googleId: googleId, verified: true }
          });
        } else {
          return res.status(409).json({ 
            message: 'An account with this email already exists. Please login with your existing account.' 
          });
        }
      }
      // If user exists with different email but same Google ID, prevent registration
      else if (user.googleId === googleId && user.email && user.email !== email) {
        return res.status(409).json({ 
          message: 'An account with this Google ID already exists. Please login with your existing account.' 
        });
      }
      // Update existing user with Google ID if not present (linking existing email account)
      else if (!user.googleId) {
        // Check if another user already has this Google ID
        const existingGoogleUser = await prisma.users.findUnique({
          where: { googleId: googleId }
        });
        
        if (existingGoogleUser) {
          return res.status(409).json({ 
            message: 'This Google account is already linked to another user.' 
          });
        }
        
        user = await prisma.users.update({
          where: { id: user.id },
          data: { googleId: googleId }
        });
      }
    } else {
      // Create new user
      user = await prisma.users.create({
        data: {
          name: name,
          email: email,
          googleId: googleId,
          verified: true,
          p_verified: true
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, first_name: user.first_name, last_name: user.last_name, verified: user.verified, is_admin: user.is_admin, has_hotel: user.has_hotel },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Update user token
    await prisma.users.update({
      where: { id: user.id },
      data: { token: token }
    });

    res.status(200).json({
      message: 'Google authentication successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};
