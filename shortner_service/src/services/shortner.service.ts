import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { generateShortCodeFromUrl, isValidUrl } from "../utils/shortner.util";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { env } from "../configs/env.config";
import { prisma } from "../configs/database.config";
import { GetRedirectUrlResponse } from "../dtos/GetRedirectUrlResponse.dto";
import { AppError } from "../errors/AppError";
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

    const originalUrl = await prisma.url.findUnique({
      where : {shortCode}
    })

    if(!originalUrl){
      throw new AppError('URL not found', 404);
    }

    const response:GetRedirectUrlResponse = {
      originalUrl : originalUrl.url
    }

    return response;
  }
}