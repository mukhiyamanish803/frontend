import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://backend-7wlz.onrender.com/api/public",
  withCredentials: true,
});

// Add this to your existing publicApi endpoints
const searchJobs = async (searchParams) => {
  return await publicApi.post("/search-jobs", searchParams);
};

// Add to your exports
export { searchJobs };
export default publicApi;
