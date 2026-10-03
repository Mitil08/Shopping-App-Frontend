import api from './api';

export const sellerApi = {
  getDashboard: async () => {
    return await api.get('/seller/dashboard');
  },

  getProducts: async () => {
    return await api.get('/seller/products');
  },

  getOrders: async () => {
    return await api.get('/seller/orders');
  },

  updateFulfillmentStatus: async (orderId, status) => {
    return await api.put(`/seller/orders/${orderId}/status`, { status });
  },

  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (productId, productData) => {
    return await api.put(`/products/${productId}`, productData);
  },

  deleteProduct: async (productId) => {
    return await api.delete(`/products/${productId}`);
  },
};
