import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { ShortnerService } from "../services/shortner.service";
import { GetRedirectUrlRequest } from "../dtos/GetRedirectUrlRequest.dto";
import { GetRedirectUrlResponse } from "../dtos/GetRedirectUrlResponse.dto";

export class ShortnerController {
  public static createShortUrl = async (
    req: Request<{},{},CreateShortUrlRequestDTO>,
    res: Response<CreateShortUrlResponseDTO>
  )=>{
    try {
      await ShortnerService.createShortUrl(req,res);
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } as any);
    }
  }

  public static getOriginalUrl = async (
    req: Request<{},{},GetRedirectUrlRequest>,
    res: Response<GetRedirectUrlResponse>
  )=>{
    try {
      await ShortnerService.getOriginalUrl(req,res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } as any);
    }
  }
}