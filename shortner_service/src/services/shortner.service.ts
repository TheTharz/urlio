import { Request } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { generateShortCodeFromUrl } from "../utils/shortner.util";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { env } from "../configs/env.config";

export class ShortnerService {

  public static createShortUrl = async (req: Request<{},{},CreateShortUrlRequestDTO>, res: Response<CreateShortUrlResponseDTO>) => {
    const {url} = req.body;

    const shortCode = generateShortCodeFromUrl(url);

    const response:CreateShortUrlResponseDTO = {
      shortUrl: `${env.BASE_URL}/r/${shortCode}`
    }

    return res.status(200).json(response);
  }

}