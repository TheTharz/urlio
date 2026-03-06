import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { generateShortCodeFromUrl, isValidUrl } from "../utils/shortner.util";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { env } from "../configs/env.config";
import { prisma } from "../configs/database.config";
import { GetRedirectUrlResponse } from "../dtos/GetRedirectUrlResponse.dto";
import { AppError } from "../errors/AppError";
import redisClient from "../configs/redis.config";
import { logger } from "../configs/logger.config";
export class ShortnerService {

  public static createShortUrl = async (req: Request<{},{},CreateShortUrlRequestDTO>, res: Response<CreateShortUrlResponseDTO>) => {
    const {url} = req.body;

    if(!isValidUrl(url)){
      throw new AppError("Invalid url",400);
    }

    const shortCode = generateShortCodeFromUrl(url);

    const response:CreateShortUrlResponseDTO = {
      shortUrl: `${env.BASE_URL}/r/${shortCode}`
    }

    const shortUrl = await prisma.url.create({
      data : {
        shortCode : shortCode,
        url : url
      }
    })

    return res.status(200).json(response);
  }

  public static getOriginalUrl = async (shortCode:string): Promise<GetRedirectUrlResponse> => {

    try {
      // Check in Redis cache
      const cachedOriginalUrl = await redisClient.get(shortCode);

      if(cachedOriginalUrl){
        logger.info({ shortCode }, 'Cache hit');
        return {
          originalUrl : cachedOriginalUrl
        };
      }
    } catch (error) {
      logger.error({ error, shortCode }, 'Failed to get from cache');
      // Continue to database if Redis fails
    }

    logger.info({ shortCode }, 'Cache miss');

    // If not in cache, get from database
    const originalUrl = await prisma.url.findUnique({
      where : {shortCode}
    })

    if(!originalUrl){
      throw new AppError('URL not found', 404);
    }

    // Cache the result in Redis (24 hours TTL)
    try {
      await redisClient.setEx(shortCode, 60 * 60 * 24, originalUrl.url);
    } catch (error) {
      logger.error({ error, shortCode }, 'Failed to set cache');
      // Continue even if caching fails
    }

    const response:GetRedirectUrlResponse = {
      originalUrl : originalUrl.url
    }

    return response;
  }
}