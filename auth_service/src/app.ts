import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Simple health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "auth_service" });
});

export default app;
