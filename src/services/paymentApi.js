import api from './api';

/**
 * Service to interact with Razorpay endpoints on the backend:
 * - STEP 1: POST /api/create-order
 * - STEP 3: POST /api/verify-payment
 * - GET /api/payment/key-id
 */
export const paymentApi = {
  createRazorpayOrder: async ({ amount, currency = 'INR', receipt, notes }) => {
    return await api.post('/create-order', {
      amount, // in paise
      currency,
      receipt,
      notes,
    });
  },

  verifyRazorpayPayment: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    return await api.post('/verify-payment', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
  },

  getKeyId: async () => {
    return await api.get('/payment/key-id');
  },
};

export default paymentApi;
