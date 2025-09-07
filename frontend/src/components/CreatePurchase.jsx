// components/CreatePurchase.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import '../styles/createPurchase.css'

const CreatePurchase = () => {
  const [formData, setFormData] = useState({
    purchaseDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    productName: '',
    quantity: '',
    message: ''
  });
  const [options, setOptions] = useState({
    districts: [],
    products: [],
    deliveryTimes: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const data = await ApiService.getPurchaseOptions();
      setOptions(data);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
    if (!formData.deliveryLocation) newErrors.deliveryLocation = 'Delivery location is required';
    if (!formData.productName) newErrors.productName = 'Product name is required';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Valid quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      await ApiService.createPurchase({
        ...formData,
        quantity: parseInt(formData.quantity)
      });
      
      setSuccess(true);
      setFormData({
        purchaseDate: '',
        deliveryTime: '',
        deliveryLocation: '',
        productName: '',
        quantity: '',
        message: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to create purchase:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-purchase">
      <h1>Create New Purchase</h1>
      
      {success && (
        <div className="success-message">
          Purchase created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="purchase-form">
        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date *</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={errors.purchaseDate ? 'error' : ''}
          />
          {errors.purchaseDate && <span className="error-text">{errors.purchaseDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="deliveryTime">Delivery Time *</label>
          <select
            id="deliveryTime"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            className={errors.deliveryTime ? 'error' : ''}
          >
            <option value="">Select a time</option>
            {options.deliveryTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.deliveryTime && <span className="error-text">{errors.deliveryTime}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="deliveryLocation">Delivery District *</label>
          <select
            id="deliveryLocation"
            name="deliveryLocation"
            value={formData.deliveryLocation}
            onChange={handleChange}
            className={errors.deliveryLocation ? 'error' : ''}
          >
            <option value="">Select a district</option>
            {options.districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {errors.deliveryLocation && <span className="error-text">{errors.deliveryLocation}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="productName">Product *</label>
          <select
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={errors.productName ? 'error' : ''}
          >
            <option value="">Select a product</option>
            {options.products.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
          {errors.productName && <span className="error-text">{errors.productName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="999"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <span className="error-text">{errors.quantity}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            maxLength="500"
            placeholder="Any special instructions..."
          />
          <div className="char-count">{formData.message.length}/500</div>
        </div>
        
        {errors.general && <div className="error-text">{errors.general}</div>}
        
        <button 
          type="submit" 
          disabled={submitting}
          className="submit-button"
        >
          {submitting ? 'Creating...' : 'Create Purchase'}
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;