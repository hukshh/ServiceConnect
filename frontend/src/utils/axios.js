import axios from 'axios';

// Creates a pre-configured axios instance with base URL and auth token interceptor
const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Request interceptor that attaches JWT token from localStorage to every outgoing request
API.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
