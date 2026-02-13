import { getOriginalUrl } from "../clients/shortner-service.client";

export class RedirectService{
  public static async getOriginalUrl(shortCode:string):Promise<string| null>{
    const url = (await getOriginalUrl(shortCode)).originalUrl;
    return url;
  }
}