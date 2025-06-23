import axios from "axios";

const testApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  withCredentials: true,
});

// Add request logging interceptor
testApi.interceptors.request.use((config) => {
  const requestInfo = {
    timestamp: new Date().toISOString(),
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    headers: config.headers,
    data: config.data,
    params: config.params,
    withCredentials: config.withCredentials,
  };

  return config;
});

export default testApi;
