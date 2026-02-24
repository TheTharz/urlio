import { getOriginalUrl } from "../clients/shortner-service.client";
import { AppError } from "../errors/AppError";

export class RedirectService{
  public static async getOriginalUrl(shortCode:string):Promise<string>{
    const response = await getOriginalUrl(shortCode);

    if(!response){
      throw new AppError("Short URL not found", 404);
    }

    return response.originalUrl;
  }
}