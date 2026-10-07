import axios from 'axios';
import { API_BASE_URL } from './api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
