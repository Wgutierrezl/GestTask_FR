import axios from "axios";

const api = axios.create({
  /* baseURL: "http://alb-gesttask-1697059265.us-east-1.elb.amazonaws.com:8097" */
  baseURL: import.meta.env.VI,
});

// 🔥 Interceptor de solicitud
api.interceptors.request.use(
  (config) => {

    // Si la petición dice skipAuth, NO ponemos token
    if (config.headers?.skipAuth) {
      delete config.headers.Authorization;
      return config;
    }

    // Si NO tiene skipAuth, agregamos token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
