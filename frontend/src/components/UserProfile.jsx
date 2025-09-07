// components/UserProfile.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await ApiService.getUserProfile();
      setProfile(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      
      <div className="profile-card">
        <div className="profile-field">
          <label>Username:</label>
          <span>{profile.username}</span>
        </div>
        
        <div className="profile-field">
          <label>Name:</label>
          <span>{profile.name}</span>
        </div>
        
        <div className="profile-field">
          <label>Email:</label>
          <span>{profile.email}</span>
        </div>
        
        <div className="profile-field">
          <label>Contact Number:</label>
          <span>{profile.contactNumber}</span>
        </div>
        
        <div className="profile-field">
          <label>Country:</label>
          <span>{profile.country}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;