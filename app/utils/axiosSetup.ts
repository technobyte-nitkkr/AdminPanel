// app/axiosSetup.ts or lib/axiosSetup.ts
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL; // use NEXT_PUBLIC_ prefix

axios.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
