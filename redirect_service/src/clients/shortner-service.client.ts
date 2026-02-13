import axios from "axios"
import { env } from "../configs/env.config"

export const getOriginalUrl = async (shortCode:string) : Promise<string> => {
  const response = await axios.post<string>(
    `${env.SHORTNER_SERIVCE_URL}/originalurl`,
    {
      shortCode
    }
  );

  return response.data;
}