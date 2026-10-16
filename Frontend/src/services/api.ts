import axios from 'axios';

export const CANONICAL_BACKEND_URL = 'https://fit-meister-backend.vercel.app/api/v1';

function resolveApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  // If empty or undefined, use production backend
  if (!envUrl) {
    return CANONICAL_BACKEND_URL;
  }

  // Detect Vercel preview deployment URL and map to canonical public backend
  if (envUrl.includes('fit-meister-backend') && envUrl.includes('.vercel.app') && !envUrl.startsWith('https://fit-meister-backend.vercel.app')) {
    console.info(
      '[FitMeister API] Detected preview deployment URL. Auto-routing to canonical production backend:',
      CANONICAL_BACKEND_URL
    );
    return CANONICAL_BACKEND_URL;
  }

  let finalUrl = envUrl.replace(/\/+$/, '');
  if (!finalUrl.endsWith('/api/v1')) {
    finalUrl = `${finalUrl}/api/v1`;
  }

  return finalUrl;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitmeister_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with failover support
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Failover to canonical production backend if original request failed due to host/network mismatch
    if (
      originalRequest &&
      !originalRequest._retry &&
      (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) &&
      api.defaults.baseURL !== CANONICAL_BACKEND_URL
    ) {
      console.warn('[FitMeister API] Primary endpoint unreachable. Retrying with canonical production backend...');
      originalRequest._retry = true;
      originalRequest.baseURL = CANONICAL_BACKEND_URL;
      return axios(originalRequest);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('fitmeister_token');
      localStorage.removeItem('fitmeister_user');
    }

    return Promise.reject(error);
  }
);
