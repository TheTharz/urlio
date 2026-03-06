import express, { Application } from "express";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/analytics", analyticsRoutes);

app.use(errorHandler);

export default app;