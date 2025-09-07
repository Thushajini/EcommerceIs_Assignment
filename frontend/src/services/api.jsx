// services/api.js
import { authConfig } from '../config/authConfig';

class ApiService {
  constructor() {
    this.baseURL = authConfig.apiBaseUrl;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include'
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token might be expired, redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Purchase endpoints
  getPurchases() {
    return this.request('/purchases');
  }

  getUpcomingPurchases() {
    return this.request('/purchases/upcoming');
  }

  getPastPurchases() {
    return this.request('/purchases/past');
  }

  createPurchase(purchaseData) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
  }

  getPurchaseOptions() {
    return this.request('/purchases/options');
  }

 
  getUserProfile() {
    return this.request('/user/profile');
  }
}

export default new ApiService();