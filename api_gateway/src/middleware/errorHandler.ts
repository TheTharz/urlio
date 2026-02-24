import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("API Gateway Error:", err);

  return res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred in API Gateway",
  });
};
