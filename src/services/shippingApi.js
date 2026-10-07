import axios from 'axios';
import { API_BASE_URL } from './api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const shippingApi = {
  /**
   * 1-Click Courier Dispatch & AWB Generation
   */
  createShipment: async (orderData) => {
    const res = await api.post('/shipping/create-shipment', orderData);
    return res.data;
  },

  /**
   * Track Shipment by Order ID or AWB Code
   */
  trackShipment: async (idOrAwb) => {
    const res = await api.get(`/shipping/track/${idOrAwb}`);
    return res.data;
  },

  /**
   * Check Pincode Delivery Serviceability
   */
  checkPincode: async (pincode) => {
    const res = await api.post('/shipping/serviceability', { pincode });
    return res.data;
  },

  /**
   * Automated Delhivery Reverse Courier Pickup Dispatch
   */
  createReversePickup: async (orderId, returnTicket) => {
    const res = await api.post('/shipping/create-reverse-pickup', { orderId, returnTicket });
    return res.data;
  },

  /**
   * Automated Instant Razorpay Refund
   */
  processRefund: async (refundData) => {
    const res = await api.post('/payment/refund', refundData);
    return res.data;
  },

  /**
   * Get Shipping Label HTML URL
   */
  getLabelUrl: (orderId) => {
    return `${API_URL}/shipping/label/${orderId}`;
  },
};
