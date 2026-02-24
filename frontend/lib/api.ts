import axios from "axios";
import { ApiError } from "./errors";

// Re-export for convenience
export { ApiError };

const axiosInstance = axios.create(
  {
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    withCredentials : true,
    headers : {
      "Content-Type" : "application/json",
    },
    timeout : 10000,
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from response
    const errorMessage = 
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    
    const statusCode = error.response?.status;
    
    // Only log unexpected errors (not validation errors)
    if (!statusCode || statusCode >= 500) {
      console.error("[API Error]", {
        message: errorMessage,
        status: statusCode,
        url: error.config?.url,
      });
    }
    
    // Create ApiError instead of generic Error
    return Promise.reject(new ApiError(errorMessage, statusCode));
  }
);

export default axiosInstance;