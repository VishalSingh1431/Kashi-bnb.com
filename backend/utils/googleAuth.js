import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// Generate Google OAuth URL
export const generateGoogleAuthURL = (action = 'login') => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  // Get the callback URL from environment or construct it
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/auth/google/callback`;

  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: action, // Pass action through state parameter
    redirect_uri: callbackURL // Add the missing redirect_uri parameter
  });
};

// Verify Google ID token
export const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    return {
      success: true,
      user: {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: Boolean(payload.email_verified),
        name: payload.name,
        picture: payload.picture
      }
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Exchange authorization code for tokens
export const exchangeCodeForTokens = async (code) => {
  try {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Get user info using the access token
    const userInfo = await googleClient.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo'
    });

    return {
      success: true,
      user: {
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        emailVerified: Boolean(userInfo.data.verified_email),
        name: userInfo.data.name,
        picture: userInfo.data.picture
      }
    };
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
