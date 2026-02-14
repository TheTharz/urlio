import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { ShortnerService } from "../services/shortner.service";
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
    req: Request<{shortCode:string}>,
    res: Response<GetRedirectUrlResponse | { message: string }>
  )=>{
    try {
      const {shortCode} = req.params;
      const result = await ShortnerService.getOriginalUrl(shortCode);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" } as any);
    }
  }
}