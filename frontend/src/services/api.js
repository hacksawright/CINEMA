import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, data);
      
      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/auth';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
      
      // Return structured error
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.fieldErrors || null,
        data: data
      });
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: null,
        data: null
      });
    } else {
      // Other error
      console.error('❌ Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: null,
        data: null
      });
    }
  }
);

// Generic API methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

// Export the configured client
export default apiClient;
