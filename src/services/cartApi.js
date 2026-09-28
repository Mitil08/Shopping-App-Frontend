import api from './api';

export const cartApi = {
  getCart: async () => {
    return await api.get('/cart');
  },

  addItem: async (item) => {
    return await api.post('/cart', item);
  },

  updateItem: async (itemId, quantity) => {
    return await api.put(`/cart/items/${itemId}`, { quantity });
  },

  removeItem: async (itemId) => {
    return await api.delete(`/cart/items/${itemId}`);
  },

  syncCart: async (items) => {
    return await api.post('/cart/sync', { items });
  },

  clearCart: async () => {
    return await api.delete('/cart');
  }
};
