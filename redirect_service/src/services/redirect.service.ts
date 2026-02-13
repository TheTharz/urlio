import { getOriginalUrl } from "../clients/shortner-service.client";

export class RedirectService{
  public static async getOriginalUrl(shortCode:string):Promise<string| null>{
    const originalUrl = getOriginalUrl(shortCode);
    return originalUrl;
  }
}