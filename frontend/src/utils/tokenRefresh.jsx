// utils/tokenRefresh.js
import { authConfig } from '../config/authConfig';

let refreshTimeout = null;

export const scheduleTokenRefresh = (expiresIn) => {
  // Clear existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  
  // Schedule refresh 1 minute before expiration
  const refreshTime = (expiresIn - 60) * 1000;
  
  refreshTimeout = setTimeout(() => {
    refreshToken();
  }, refreshTime);
};

export const refreshToken = async () => {
  try {
    // This would typically use a refresh token
    // For security, this should be handled by your backend
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      scheduleTokenRefresh(data.expires_in);
    } else {
      console.error('Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
  }
};