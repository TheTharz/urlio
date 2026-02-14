import axios from "axios";

export const httpClient = axios.create({
  timeout: 500000, // Set a timeout for requests (optional)
  headers: {
    "Content-Type": "application/json",
  }
})