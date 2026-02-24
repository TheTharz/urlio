import { Request, Response, NextFunction } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { ShortnerService } from "../services/shortner.service";
import { GetRedirectUrlResponse } from "../dtos/GetRedirectUrlResponse.dto";

export class ShortnerController {
  public static createShortUrl = async (
    req: Request<{},{},CreateShortUrlRequestDTO>,
    res: Response<CreateShortUrlResponseDTO>,
    next: NextFunction
  )=>{
    try {
      await ShortnerService.createShortUrl(req,res);
    } catch (error:any) {
      next(error);
    }
  }

  public static getOriginalUrl = async (
    req: Request<{shortCode:string}>,
    res: Response<GetRedirectUrlResponse | { message: string }>,
    next: NextFunction
  )=>{
    try {
      const {shortCode} = req.params;
      const result = await ShortnerService.getOriginalUrl(shortCode);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}