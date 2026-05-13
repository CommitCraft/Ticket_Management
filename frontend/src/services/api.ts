import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from './token';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
        const nextAccessToken = refreshResponse.data?.accessToken as string | undefined;
        if (nextAccessToken) {
          setAccessToken(nextAccessToken);
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
          return api.request(originalRequest);
        }
      } catch {
        clearAccessToken();
      }
    }
    return Promise.reject(error);
  }
);
