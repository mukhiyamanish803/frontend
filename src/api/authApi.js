import axios from 'axios';
import { handle401 } from './handle401';

const authApi = axios.create({
  baseURL: 'https://backend-7wlz.onrender.com/api/auth',
  withCredentials: true,
});


authApi.interceptors.response.use(
  response => response,
  error => handle401(error, authApi)
);

export default authApi;