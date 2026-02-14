import axios from "axios"
import { env } from "../configs/env.config"
import { GetOriginalUrlResponse } from "../dtos/get-original-url-reponse.dto";
import { httpClient } from "./http.client";
import { AxiosError } from "axios";

export const getOriginalUrl = async (shortCode:string) : Promise<GetOriginalUrlResponse | null> => {
  try {
    const response = await httpClient.get<GetOriginalUrlResponse>(
      `${env.SHORTNER_SERIVCE_URL}/originalurl/${shortCode}`
    );

    return response.data;
  } catch (error:any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }

      console.error("Shortener service error:", error.response?.status);
    }

    throw new Error("Shortener service unavailable");
  }
}