import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loyaltyApi = {
  /**
   * Submit a verified product review & claim 500 points
   */
  submitReview: async (reviewData) => {
    const res = await api.post('/loyalty/review', reviewData);
    return res.data;
  },

  /**
   * Get Product Reviews & Ratings Breakdown
   */
  getProductReviews: async (productId) => {
    const res = await api.get(`/loyalty/reviews/${productId}`);
    return res.data;
  },

  /**
   * Get User Loyalty Points & VIP Perks
   */
  getUserPoints: async (userId) => {
    const res = await api.get(`/loyalty/points/${userId || ''}`);
    return res.data;
  },

  /**
   * Dispatch Post-Delivery Review Invitation
   */
  triggerReviewInvite: async (orderId) => {
    const res = await api.post(`/loyalty/invite/${orderId}`);
    return res.data;
  },
};
