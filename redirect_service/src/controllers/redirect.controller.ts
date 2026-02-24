import { Request, Response, NextFunction } from "express";
import { RedirectService } from "../services/redirect.service";

export class RedirectController{
  public static redirectToOriginal = async (
    req:Request<{shortCode:string}>,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {shortCode} = req.params;
      const originalUrl = await RedirectService.getOriginalUrl(shortCode);
      return res.redirect(302,originalUrl); 
    } catch (error) {
      next(error);
    }
  }
}