import express, { Application, Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "./configs/env.config";
import axios from "axios";

const app: Application = express();
app.use(express.json());

// Microservice base URLs
const SERVICES = {
  shortener: env.SHORTNER_SERIVCE_URL,
  redirect: env.REDIRECT_SERIVCE_URL,
};

// === User-facing redirect with proxy ===
// Type for request params
interface RedirectParams {
  shortCode: string;
}

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
  })
);

// === API v1 routes (shortener) ===
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
    res.status(err.response?.status || 500).json({ message: err.message });
  }
};

app.use("/api/v1/shorten", (req, res) => {
  let pathWithoutPrefix = req.originalUrl.replace(/^\/api\/v1\/shorten/, "");
  if (pathWithoutPrefix === "") pathWithoutPrefix = "/";
  const target = `${SERVICES.shortener}${pathWithoutPrefix}`;
  proxyRequest(req, res, target);
});

export default app;
