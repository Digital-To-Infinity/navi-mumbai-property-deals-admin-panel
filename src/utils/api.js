import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://api.navimumbaipropertydeals.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
