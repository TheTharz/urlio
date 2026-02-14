import { Router } from "express";
import { RedirectController } from "../controllers/redirect.controller";

const router = Router();

router.get("/originalurl/:shortCode",RedirectController.redirectToOriginal);

export default router;