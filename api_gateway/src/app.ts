import express, { Application, Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "./configs/env.config";
import axios from "axios";
import { RedirectParams } from "./dtos/redirect-params.dto";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { ServerResponse } from "http";

const app: Application = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:3000"]

app.use(cors(
  {
    origin : function(origin,callback){
      if(!origin || allowedOrigins.includes(origin)){
        callback(null,true);
      }else{
        callback(new Error("Not allowed by cors"))
      }
    },
    credentials:true,
  }
))

// Microservice base URLs
const SERVICES = {
  shortener: env.SHORTNER_SERIVCE_URL,
  redirect: env.REDIRECT_SERIVCE_URL,
};

app.use(
  "/r/:shortCode",
  createProxyMiddleware({
    target: SERVICES.redirect,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Cast to Express Request with params type
      const expressReq = req as unknown as Request<RedirectParams>;
      const shortCode = expressReq.params.shortCode;
      return `/originalurl/${shortCode}`;
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
      },
      error: (err, req, res) => {
        console.error("[Proxy Error]", err);
        if (res instanceof ServerResponse) {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ 
            success: false, 
            message: "Redirect service unavailable" 
          }));
        }
      }
    }
  })
);

// === API v1 routes ===
const proxyRequest = async (req: any, res: any, targetUrl: string) => {
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
    });
    res.status(response.status).json(response.data);
  } catch (err: any) {
    // Forward the actual error response from the backend service
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(503).json({ 
        success: false, 
        message: "Service unavailable" 
      });
    }
  }
};

app.use("/api/v1/shorten", (req, res) => {
  let pathWithoutPrefix = req.originalUrl.replace(/^\/api\/v1\/shorten/, "");
  if (pathWithoutPrefix === "") pathWithoutPrefix = "/";
  const target = `${SERVICES.shortener}${pathWithoutPrefix}`;
  proxyRequest(req, res, target);
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
