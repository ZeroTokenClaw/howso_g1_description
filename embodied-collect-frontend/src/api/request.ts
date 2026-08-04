import axios, { AxiosError } from "axios";
import { message } from "antd";
import type { ApiResponse } from "@/types/common";
import { useAuthStore } from "@/store/auth";
import { useAppStore } from "@/store/app";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  useAppStore.getState().startLoading();
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (response) => {
    useAppStore.getState().endLoading();
    const payload: ApiResponse = response.data;
    if (payload.code !== 200) {
      message.error(payload.message || "请求失败");
      if (payload.code === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
      return Promise.reject(payload);
    }
    return payload as unknown as never;
  },
  async (error: AxiosError) => {
    useAppStore.getState().endLoading();
    const originalConfig = error.config as (typeof error.config & { __retry?: boolean }) | undefined;
    if (error.response?.status === 401) {
      message.error("登录失效，请重新登录");
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }
    if (!error.response && originalConfig && !originalConfig.__retry) {
      originalConfig.__retry = true;
      return request(originalConfig);
    }
    message.error(error.message || "网络错误");
    return Promise.reject(error);
  },
);

export default request;
