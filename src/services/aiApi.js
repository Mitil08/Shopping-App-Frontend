import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = {
  /**
   * Send query to 24/7 AI Concierge
   */
  chat: async (message, context = {}) => {
    const res = await api.post('/ai/chat', { message, context });
    return res.data;
  },
};
