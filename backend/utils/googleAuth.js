import { OAuth2Client } from 'google-auth-library';

// Validate required environment variables
const validateGoogleConfig = () => {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Google OAuth environment variables: ${missing.join(', ')}`);
  }
  
  // Get the callback URL - prioritize GOOGLE_CALLBACK_URL, then construct from BACKEND_URL
  let callbackURL = process.env.GOOGLE_CALLBACK_URL;
  
  if (!callbackURL) {
    if (process.env.BACKEND_URL) {
      callbackURL = `${process.env.BACKEND_URL}/api/v1/auth/google/callback`;
    } else if (process.env.NODE_ENV === 'production') {
      throw new Error('GOOGLE_CALLBACK_URL or BACKEND_URL must be set in production');
    } else {
      callbackURL = 'http://localhost:3000/api/v1/auth/google/callback';
    }
  }
  
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  };
};

// Initialize Google OAuth client
let googleClient = null;

const getGoogleClient = () => {
  if (!googleClient) {
    try {
      const config = validateGoogleConfig();
      googleClient = new OAuth2Client(
        config.clientId,
        config.clientSecret,
        config.callbackURL
      );
      console.log('Google OAuth client initialized with callback URL:', config.callbackURL);
    } catch (error) {
      console.error('Failed to initialize Google OAuth client:', error.message);
      throw error;
    }
  }
  return googleClient;
};

// Generate Google OAuth URL
export const generateGoogleAuthURL = (action = 'login') => {
  try {
    const client = getGoogleClient();
    const config = validateGoogleConfig();
    
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const authURL = client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: action,
      redirect_uri: config.callbackURL
    });

    console.log('Generated Google OAuth URL with redirect_uri:', config.callbackURL);
    return authURL;
    
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    throw new Error(`Failed to generate Google OAuth URL: ${error.message}`);
  }
};

// Verify Google ID token
export const verifyGoogleToken = async (idToken) => {
  try {
    const client = getGoogleClient();
    const config = validateGoogleConfig();
    
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: config.clientId
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
    const client = getGoogleClient();
    
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info using the access token
    const userInfo = await client.request({
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
