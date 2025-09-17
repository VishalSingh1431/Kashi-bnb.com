import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processAuth = async () => {
      if (hasProcessed.current) return;
    
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');
      const userDataParam = searchParams.get('userData');

      if (token && userId && userDataParam) {
        hasProcessed.current = true;
        
        try {
          // Parse the userData from Google OAuth response
          const userData = JSON.parse(decodeURIComponent(userDataParam));
          login(token, userData);
          
          // Check for redirect parameter and navigate accordingly
          const redirectUrl = searchParams.get('redirect');
          if (redirectUrl) {
            navigate(decodeURIComponent(redirectUrl), { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/login', { replace: true });
        }
      } else if (token && userId) {
        // Fallback: if no userData, create basic user object
        hasProcessed.current = true;
        const userData = { id: userId };
        login(token, userData);
        
        // Check for redirect parameter and navigate accordingly
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl), { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        hasProcessed.current = true;
        // No token or userId, redirect to login
        console.error('Missing token or userId in callback');
        navigate('/login', { replace: true });
      }
    };
    
    processAuth();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
