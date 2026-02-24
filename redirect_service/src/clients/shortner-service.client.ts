import axios from "axios"
import { env } from "../configs/env.config"
import { GetOriginalUrlResponse } from "../dtos/get-original-url-reponse.dto";
import { httpClient } from "./http.client";
import { AxiosError } from "axios";
import { AppError } from "../errors/AppError";

export const getOriginalUrl = async (shortCode:string) : Promise<GetOriginalUrlResponse | null> => {
  try {
    const response = await httpClient.get<GetOriginalUrlResponse>(
      `${env.SHORTNER_SERIVCE_URL}/originalurl/${shortCode}`
    );

    return response.data;
  } catch (error:any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Shortener service error:", error.response?.status);
    }

    throw new AppError(
      error.response?.data?.message || "Shortener service unavailable",
      error.response?.status || 503
    );
  }
}