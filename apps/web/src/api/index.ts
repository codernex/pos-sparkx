import axios from "axios";
import { toast } from "react-toastify";

export const baseURL = "http://localhost:9000/api/v1";

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((data: any) => {
  data.headers!.Authorization = "Bearer " + localStorage.getItem("token");
  return data;
});

let errorTimer: NodeJS.Timeout;

// Add an interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    const errorStatus = error.response?.status;

    // Clear the previous timer
    clearTimeout(errorTimer);

    // Start a new timer to display the toast after 1 second
    errorTimer = setTimeout(() => {
      // Show a toast notification
      if (errorStatus === 401 || errorStatus === 500) toast.error(errorMessage);
    }, 1000);

    return Promise.reject(error);
  }
);
export default api;
