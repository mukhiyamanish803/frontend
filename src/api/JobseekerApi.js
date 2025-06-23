import axios from 'axios';
import { handle401 } from './handle401';

const jobseekerApi = axios.create({
  baseURL: 'https://backend-7wlz.onrender.com/api/user/jobseeker',
  withCredentials: true,
});

jobseekerApi.interceptors.response.use(
  response => response,
  error => handle401(error, jobseekerApi)
);

export default jobseekerApi;