import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const username = localStorage.getItem("cyberguard_user") || "anonymous";
  const role = localStorage.getItem("cyberguard_role") || "Guest";

  config.headers["X-Username"] = username;
  config.headers["X-Role"] = role;

  return config;
});

export default api;