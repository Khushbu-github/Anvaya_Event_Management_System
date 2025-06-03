import axios from 'axios';
import { getToken } from './auth';
import type { InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance; 