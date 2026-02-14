import { getOriginalUrl } from "../clients/shortner-service.client";

export class RedirectService{
  public static async getOriginalUrl(shortCode:string):Promise<string>{
    const response = await getOriginalUrl(shortCode);

    if(!response){
      console.error(`URL for short code : ${shortCode} not found`)
      throw new Error("The original url was not found in the serivce");
    }

    return response.originalUrl;
  }
}