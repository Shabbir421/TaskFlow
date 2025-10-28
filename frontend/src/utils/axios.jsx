import axios from "axios";

// Base URL for your backend
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
  withCredentials: true, // If using cookies
});

export default axiosInstance;
