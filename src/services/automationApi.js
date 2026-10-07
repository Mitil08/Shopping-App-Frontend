import api, { API_BASE_URL } from './api';

export const automationApi = {
  // 1. Abandoned Cart Recovery
  scanAbandonedCarts: async (minMinutes = 15) => {
    const res = await api.post('/automation/abandoned-cart/scan', { minMinutes });
    return res.data;
  },
  testAbandonedCart: async (email, phone = null) => {
    const res = await api.post('/automation/abandoned-cart/test', { email, phone });
    return res.data;
  },

  // 2. Inventory & Low Stock Alerts
  getLowStockAlerts: async () => {
    const res = await api.get('/automation/inventory/low-stock');
    return res.data;
  },
  restockProduct: async (productId, variantId, quantity = 10) => {
    const res = await api.post('/automation/inventory/restock', { productId, variantId, quantity });
    return res.data;
  },

  // 3. Midnight Financial Settlements
  getSettlements: async () => {
    const res = await api.get('/automation/settlements');
    return res.data;
  },
  generateSettlement: async (sellerId = null, period = null) => {
    const res = await api.post('/automation/settlements/generate', { sellerId, period });
    return res.data;
  },
  getStatementUrl: (settlementId) => {
    return `${API_BASE_URL}/automation/settlements/${settlementId}/statement`;
  },

  // 4. Wishlist Price Drops & Restock Alerts
  syncWishlist: async (userId, items, email = null, phone = null) => {
    const res = await api.post('/automation/wishlist/sync', { userId, items, email, phone });
    return res.data;
  },
  testWishlistAlert: async (type = 'price_drop', email = null, phone = null) => {
    const res = await api.post('/automation/wishlist/test', { type, email, phone });
    return res.data;
  },
};
