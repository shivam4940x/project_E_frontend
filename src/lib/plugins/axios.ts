import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

// === Token Getters ===
const get = {
  AuthToken: (): string | null => localStorage.getItem("jwt"),
  RefreshToken: (): string | null => localStorage.getItem("refresh_token"),
};

// === Fallback to login ===
const fallBack = (): void => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

// === Refresh Control ===
let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string): void => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => void): void => {
  subscribers.push(callback);
};

// === Request Interceptor ===
axiosInstance.interceptors.request.use(
  (config) => {
    const token = get.AuthToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Response Interceptor ===
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      const refreshToken = get.RefreshToken();

      if (!refreshToken) {
        fallBack();
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const response = await axios.post<RefreshResponse>(
          "http://localhost:3000/api/auth/token/refresh",
          {
            refreshToken
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("jwt", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
        console.log('Token refreshed');
        onTokenRefreshed(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        fallBack();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
