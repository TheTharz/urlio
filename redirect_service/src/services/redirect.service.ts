import { getOriginalUrl } from "../clients/shortner-service.client";
import { AppError } from "../errors/AppError";
import redisClient from "../configs/redis.config";

export class RedirectService {
  public static async getOriginalUrl(shortCode: string): Promise<string> {
    const response = await getOriginalUrl(shortCode);

    if (!response) {
      throw new AppError("Short URL not found", 404);
    }

    return response.originalUrl;
  }

  public static publishClickEvent(shortCode: string, ipAddress: string, userAgent: string, referer: string) {
    if (redisClient.isOpen) {
      redisClient.xAdd('url_clicks_stream', '*', {
        shortCode,
        ipAddress,
        userAgent,
        referer,
        timestamp: new Date().toISOString()
      }).catch(err => console.error('Failed to publish to redis:', err));
    }
  }
}