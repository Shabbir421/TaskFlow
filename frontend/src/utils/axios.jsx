/** @format */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://task-flow-backend-beige.vercel.app",
  withCredentials: true,
});

export default axiosInstance;
