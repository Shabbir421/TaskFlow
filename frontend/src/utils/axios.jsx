/** @format */

import axios from "axios";

// Base URL for your backend
const axiosInstance = axios.create({
  baseURL: "https://task-flow-backend-beige.vercel.app/api/", // Backend base URL
  withCredentials: true, // If using cookies
});

export default axiosInstance;
