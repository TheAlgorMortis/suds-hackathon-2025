import axios from "axios";

/**
 * Currently unset
 */
export const BASE_URL: String = "http://127.0.0.1:8000/api";
/**
 * This instance is used for all HTTP requests made to the backend API.
 *
 * Default headers are set to handle `Content-Type` as JSON.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
