import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: false,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
 
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

    }
    return Promise.reject(error);
  }
);

export default api;