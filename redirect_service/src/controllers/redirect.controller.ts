import { Request, Response, NextFunction } from "express";
import { RedirectService } from "../services/redirect.service";
import redisClient from "../configs/redis.config";

export class RedirectController {
  public static redirectToOriginal = async (
    req: Request<{ shortCode: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { shortCode } = req.params;
      const originalUrl = await RedirectService.getOriginalUrl(shortCode);

      // Fire and forget analytics event
      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers.referer || '';

      RedirectService.publishClickEvent(shortCode, ipAddress, userAgent, referer);

      return res.redirect(302, originalUrl);
    } catch (error) {
      next(error);
    }
  }
}