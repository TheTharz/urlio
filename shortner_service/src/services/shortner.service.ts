import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { generateShortCodeFromUrl } from "../utils/shortner.util";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { env } from "../configs/env.config";
import {prisma} from "../configs/database.config";
import { GetRedirectUrlRequest } from "../dtos/GetRedirectUrlRequest.dto";
import { GetRedirectUrlResponse } from "../dtos/GetRedirectUrlResponse.dto";
export class ShortnerService {

  public static createShortUrl = async (req: Request<{},{},CreateShortUrlRequestDTO>, res: Response<CreateShortUrlResponseDTO>) => {
    const {url} = req.body;

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

  public static getOriginalUrl = async (req:Request<{},{},GetRedirectUrlRequest>,res:Response<GetRedirectUrlResponse>) => {
    const {shortCode} = req.body;

    const originalUrl = await prisma.url.findUnique({
      where : {shortCode}
    })

    if(!originalUrl){
      throw new Error('The url with shortcode given was not found in the database');
    }

    const response:GetRedirectUrlResponse = {
      originalUrl : originalUrl.url
    }

    return res.status(200).json(response);
  }
}