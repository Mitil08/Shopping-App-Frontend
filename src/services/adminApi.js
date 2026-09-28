import api from './api';

export const adminApi = {
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  getProducts: async (params) => {
    return await api.get('/admin/products', { params });
  },

  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },

  getOrders: async (params) => {
    return await api.get('/admin/orders', { params });
  },

  updateOrderStatus: async (orderId, status) => {
    return await api.put(`/admin/orders/${orderId}/status`, { status });
  },

  getUsers: async () => {
    return await api.get('/admin/users');
  }
};
