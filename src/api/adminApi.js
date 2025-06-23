import axios from 'axios';
import { handle401 } from './handle401';

const adminApi = axios.create({
  baseURL: 'https://backend-7wlz.onrender.com/api/admin',
  withCredentials: true,
});

adminApi.interceptors.response.use(
  response => response,
  error => handle401(error, adminApi)
);

export default adminApi;