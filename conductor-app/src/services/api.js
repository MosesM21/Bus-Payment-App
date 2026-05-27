/**
 * api.js – Axios HTTP client for the conductor app
 * Configured with base URL and automatic auth token injection.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Update with your backend URL (use ngrok or local IP for dev)
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized – token may be expired');
      // TODO: Trigger re-authentication flow
    }
    return Promise.reject(error);
  }
);

export default api;
