import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Update this based on where your backend is running
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
