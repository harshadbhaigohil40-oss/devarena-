import axios from 'axios';

// ARCHITECTURAL ROADMAP NOTE:
// Moving the access token from localStorage to memory (with refresh-cookie bootstrapping)
// is the recommended follow-up hardening step to eliminate localStorage token exposure.
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Crucial for sending the refresh token cookie
  timeout: 30000, // 30 seconds timeout to prevent infinite hanging
});

let inMemoryAccessToken = null;
let tokenChangeListeners = [];

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
  tokenChangeListeners.forEach(cb => {
    try { cb(token); } catch (e) { /* ignore */ }
  });
};

export const getAccessToken = () => inMemoryAccessToken;

export const onTokenChange = (cb) => {
  tokenChangeListeners.push(cb);
  return () => {
    tokenChangeListeners = tokenChangeListeners.filter(fn => fn !== cb);
  };
};

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = inMemoryAccessToken;
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
      setAccessToken(newAccessToken);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      
      processQueue(null, newAccessToken);
      
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      setAccessToken(null);
      localStorage.removeItem('devarena_user');
      localStorage.removeItem('devarena_token');
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
