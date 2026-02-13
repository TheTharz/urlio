import { Request, Response } from "express";
import { CreateShortUrlRequestDTO } from "../dtos/CreateShortUrlRequest.dto";
import { CreateShortUrlResponseDTO } from "../dtos/CreateShortUrlResponse.dto";
import { ShortnerService } from "../services/shortner.service";

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
}