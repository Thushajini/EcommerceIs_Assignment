// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Secure E-Commerce</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Purchases</Link>
        <Link to="/create" className="navbar-item">Create Purchase</Link>
        <div className="navbar-user">
          <Link to="/profile" className="navbar-item">Profile</Link>
          <span className="navbar-user-name">Hello, {user?.name}</span>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;