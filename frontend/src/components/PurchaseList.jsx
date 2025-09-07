// components/PurchaseList.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import '../styles/PurchaseList.css'

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, [activeTab]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      let data;
      
      if (activeTab === 'upcoming') {
        data = await ApiService.getUpcomingPurchases();
      } else if (activeTab === 'past') {
        data = await ApiService.getPastPurchases();
      } else {
        data = await ApiService.getPurchases();
      }
      
      setPurchases(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch purchases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading purchases...</div>;
  }

  return (
    <div className="purchase-list">
      <h1>My Purchases</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => setActiveTab('all')}
        >
          All Purchases
        </button>
        <button 
          className={activeTab === 'upcoming' ? 'active' : ''} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={activeTab === 'past' ? 'active' : ''} 
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {purchases.length === 0 ? (
        <div className="empty-state">
          <p>No purchases found.</p>
          <a href="/create" className="button">Create your first purchase</a>
        </div>
      ) : (
        <div className="purchase-grid">
          {purchases.map(purchase => (
            <div key={purchase.id} className="purchase-card">
              <h3>{purchase.productName}</h3>
              <p><strong>Quantity:</strong> {purchase.quantity}</p>
              <p><strong>Delivery Date:</strong> {formatDate(purchase.purchaseDate)}</p>
              <p><strong>Delivery Time:</strong> {purchase.deliveryTime}</p>
              <p><strong>Location:</strong> {purchase.deliveryLocation}</p>
              {purchase.message && <p><strong>Message:</strong> {purchase.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseList;