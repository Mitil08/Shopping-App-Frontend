import api from './api';

export const authApi = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout');
    } catch (err) {
      // client cleanup
      return { success: true };
    }
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },

  verifyEmail: async (email) => {
    return await api.post('/auth/verify-email', { email });
  },
};
