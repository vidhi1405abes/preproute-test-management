import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAuthRequest =
    config.url === "/auth/login" || config.url === "/auth/signup";

  if (!isAuthRequest) {
    const token = localStorage.getItem("preproute_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
