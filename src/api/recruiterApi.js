import axios from "axios";
import { handle401 } from "./handle401";

const recruiterApi = axios.create({
  baseURL: "https://backend-7wlz.onrender.com/api/user/recruiter",
  withCredentials: true,
});

recruiterApi.interceptors.response.use(
  (response) => response,
  (error) => handle401(error, recruiterApi)
);

// Dashboard related API methods
recruiterApi.getDashboardStats = async () => {
  const response = await recruiterApi.get("/dashboard/stats");
  return response.data;
};

recruiterApi.getRecentJobs = async () => {
  const response = await recruiterApi.get("/dashboard/recent-jobs");
  return response.data;
};

recruiterApi.getHiringProgress = async () => {
  const response = await recruiterApi.get("/dashboard/hiring-progress");
  return response.data;
};

export default recruiterApi;
