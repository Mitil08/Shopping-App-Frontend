import api from './api';

export const orderApi = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getMyOrders: async () => {
    return await api.get('/orders');
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  }
};
