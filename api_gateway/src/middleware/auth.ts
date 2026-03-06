import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.config";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string, email: string };

        // Inject the userId into the headers so downstream microservices can safely read it
        req.headers["x-user-id"] = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};
