// src/config/api.js
import axios from "axios";

let inMemoryAccessToken = null; // we keep this in JS memory

export const setAccessToken = (token) => { inMemoryAccessToken = token; };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // send/receive cookies (refresh token)
});

// Attach token if present
api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Auto refresh on 401 (once)
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      // single-flight refresh
      if (!refreshing) {
        refreshing = axios.post(
          (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/auth/refresh",
          {},
          { withCredentials: true }
        ).then((r) => r.data?.accessToken)
         .finally(() => { refreshing = null; });
      }

      const newToken = await refreshing;
      if (newToken) {
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
