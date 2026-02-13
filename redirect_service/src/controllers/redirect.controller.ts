import { Request, Response } from "express";
import { RedirectService } from "../services/redirect.service";

export class RedirectController{
  public static redirectToOriginal = async (
    req:Request<{shortCode:string}>,
    res:Response
  )=>{
    try {
      const {shortCode} = req.params;

      const originalUrl = await RedirectService.getOriginalUrl(shortCode);

      if(!originalUrl){
        return res.status(404).json({message:"Short URL not found"});
      }

      return res.redirect(302,originalUrl); 
    } catch (error) {
      console.error(`Redirect error:`,error);
      return res.status(500).json({message:"Internal server error"});
    }
  }
}