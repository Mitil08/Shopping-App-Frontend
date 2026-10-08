import axios from 'axios';
import { Capacitor } from '@capacitor/core';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'https://shopping-app-backend-bwbb.onrender.com/api';
if (Capacitor.isNativePlatform() && (rawBaseUrl.includes('localhost') || rawBaseUrl.includes('127.0.0.1'))) {
  rawBaseUrl = 'https://shopping-app-backend-bwbb.onrender.com/api';
}

export const API_BASE_URL = rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HTTP-only cookies if available
});

// Request interceptor: attach token from localStorage if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('elane_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract standardized payload and format errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    
    // Auto logout if 401 unauthorized
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('elane_token');
      localStorage.removeItem('elane_user');
      // optional trigger custom event
      window.dispatchEvent(new Event('elane-auth-expired'));
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
