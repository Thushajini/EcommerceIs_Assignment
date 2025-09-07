import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const { login } = useAuth();
  

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth2 error:', error, urlParams.get('error_description'));
      return;
    }
    
    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
    
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          redirect_uri: window.location.origin + '/callback'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('id_token', data.id_token);
        localStorage.setItem('user_info', JSON.stringify(data.user_info));
        window.location.href = '/';
      } else {
        console.error('Token exchange failed');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  };

  const handleLogin = () => {
    login();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Secure E-Commerce</h2>
        <p>Please sign in to access your account</p>
        <button onClick={handleLogin} className="login-button">
          Sign In with Asgardeo
        </button>
      </div>
    </div>
  );
};

export default Login;