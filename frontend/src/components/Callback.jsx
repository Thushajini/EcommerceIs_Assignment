// components/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Callback.css';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
  }, [navigate]);

  return (
    <div className="callback-container">
      <div className="callback-card">
        <h2>Completing Authentication</h2>
        <p>Please wait while we sign you in...</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Callback;