import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken, clearToken } from '@/lib/authToken';

// Falls back to whatever host the page was loaded from (port 5000) so the app
// works unmodified whether it's opened via localhost or a Tailscale address —
// VITE_API_URL can still override this for a fixed deployment domain.
const inferredApiUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || inferredApiUrl,
});

// Uploaded files (e.g. CSR participation proof) are served statically from
// the API origin at /<path>, not under /api/v1 — build a browsable URL for them.
export const getFileUrl = (path) => (path ? `${new URL(apiClient.defaults.baseURL).origin}/${path}` : null);

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      clearToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    toast.error(message);
    return Promise.reject(error);
  },
);
