import { Router } from "express";
import { RedirectController } from "../controllers/redirect.controller";

const router = Router();

router.get("/r/:shortCode",RedirectController.redirectToOriginal);

export default router;