import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/:shortCode", AnalyticsController.getAnalytics);

export default router;
