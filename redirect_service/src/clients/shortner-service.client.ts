import axios from "axios"
import { env } from "../configs/env.config"
import { getOriginalUrlResponse } from "../dtos/get-original-url-reponse.dto";

export const getOriginalUrl = async (shortCode:string) : Promise<getOriginalUrlResponse> => {
  const response = await axios.post<getOriginalUrlResponse>(
    `${env.SHORTNER_SERIVCE_URL}/originalurl`,
    {
      shortCode
    }
  );

  const res:getOriginalUrlResponse = {
    originalUrl:response.data.originalUrl
  }

  return res;
}