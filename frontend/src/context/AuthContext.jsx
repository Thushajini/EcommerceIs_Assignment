// import React, { createContext, useContext, useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import { getAuthorizationEndpoint } from '../config/authConfig';

// const AuthContext = createContext();


// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // AuthProvider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkAuthentication();
//   }, []);

//   const checkAuthentication = () => {
//     const token = localStorage.getItem('access_token');
    
//     if (token) {
//       try {
//         // Decode the token to check expiration
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
        
//         if (decodedToken.exp < currentTime) {
//           // Token has expired
//           logout();
//           return;
//         }
        
//         setIsAuthenticated(true);
//         const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
//         setUser(userInfo);
//       } catch (error) {
//         console.error('Invalid token:', error);
//         logout();
//       }
//     }
//     setIsLoading(false);
//   };

//   const login = () => {
//     // localStorage.setItem('access_token', token);
//     // if (userData) {
//     //   localStorage.setItem('user_info', JSON.stringify(userData));
//     //   setUser(userData);
//     // }
//     // setIsAuthenticated(true);
//     window.location.href = getAuthorizationEndpoint();
 
//     console.log('Login function called');
//   };

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('id_token');
//     localStorage.removeItem('user_info');
//     setUser(null);
//     setIsAuthenticated(false);
//     // Redirect to login page
//     window.location.href = '/login';
//   };

//   const getToken = () => {
//     return localStorage.getItem('access_token');
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     logout,
//     getToken
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!isLoading && children}
//     </AuthContext.Provider>
//   );
// };


// export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { getAuthorizationEndpoint } from '../config/authConfig';

const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        // Decode the token to check expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token has expired
          logout();
          return;
        }
        
        setIsAuthenticated(true);
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        setUser(userInfo);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setIsLoading(false);
  };

  const login = () => {
    
    window.location.href = getAuthorizationEndpoint();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_info');
    setUser(null);
    setIsAuthenticated(false);
    
    window.location.href = '/login';
  };

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const handleAuthentication = (token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
    handleAuthentication
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};


export default AuthContext;