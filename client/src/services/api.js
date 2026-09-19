import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return import.meta.env.DEV ? '/api' : 'https://devarena-ymqe.onrender.com/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Crucial for sending the refresh token cookie
  timeout: 30000, // 30 seconds timeout to prevent infinite hanging
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devarena_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses and auto-refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isAuthEndpoint = (url) => {
  if (!url) return false;
  return url.includes('/auth/login') ||
         url.includes('/auth/register') ||
         url.includes('/auth/google') ||
         url.includes('/auth/refresh') ||
         url.includes('/auth/verify-email') ||
         url.includes('/auth/forgot-password') ||
         url.includes('/auth/reset-password');
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh if no response, not 401, already retried, or request is an auth endpoint
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry ||
      isAuthEndpoint(originalRequest?.url)
    ) {
      return Promise.reject(error);
    }

    // Only attempt refresh if a token existed in localStorage
    const currentToken = localStorage.getItem('devarena_token');
    if (!currentToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = data.data.accessToken;
      localStorage.setItem('devarena_token', newAccessToken);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      
      processQueue(null, newAccessToken);
      
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      localStorage.removeItem('devarena_token');
      localStorage.removeItem('devarena_user');
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
