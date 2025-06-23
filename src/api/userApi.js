import axios from 'axios';
import { handle401 } from './handle401';

const userApi = axios.create({
  baseURL: 'https://backend-7wlz.onrender.com/api/user/',
  withCredentials: true,
});

userApi.interceptors.response.use(
  response => response,
  error => handle401(error, userApi)
);

export default userApi;