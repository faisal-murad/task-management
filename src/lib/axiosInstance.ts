// lib/axios.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Helper to get accessToken from Redux or localStorage
function getAccessToken() {
  if (typeof window !== "undefined") {
    try {
      const persisted = localStorage.getItem("persist:user");
      if (persisted) {
        const user = JSON.parse(persisted);
        const accessToken = user.accessToken ? JSON.parse(user.accessToken) : null;
        if (accessToken) return accessToken;
      }
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  }
  return null;
}

// Helper to update accessToken in both stores
function updateAccessToken(newToken: string) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("accessToken", newToken);
      
      const persisted = localStorage.getItem("persist:user");
      if (persisted) {
        const user = JSON.parse(persisted);
        user.accessToken = JSON.stringify(newToken);
        localStorage.setItem("persist:user", JSON.stringify(user));
      }
    } catch (error) {
      // Silent fail
    }
  }
}

// Helper to clear tokens
function clearTokens() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("accessToken");
      
      const persisted = localStorage.getItem("persist:user");
      if (persisted) {
        const user = JSON.parse(persisted);
        user.accessToken = JSON.stringify(null);
        localStorage.setItem("persist:user", JSON.stringify(user));
      }
    } catch (error) {
      // Silent fail
    }
  }
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(error);
    }
    
    const authEndpoints = [
      '/auth/login',
      '/auth/register', 
      '/auth/refresh-token',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email'
    ];
    
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      originalRequest?.url?.includes(endpoint)
    );
    
    const currentToken = getAccessToken();
    
    if (error.response?.status === 401 && 
        !isAuthEndpoint && 
        !originalRequest._retry &&
        currentToken) {
      
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = refreshResponse.data;
        
        if (!accessToken) {
          throw new Error('No access token received');
        }
        
        updateAccessToken(accessToken);
        
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
        
      } catch (refreshError: any) {
        clearTokens();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 401 && isAuthEndpoint) {
      clearTokens();
    }
    
    return Promise.reject(error);
  }
);

export default api;