import { Router } from "express";
import { ShortnerController } from "../controllers/shortner.controller";

const router = Router();

router.post("/create", ShortnerController.createShortUrl);
router.get("/originalurl/:shortCode", ShortnerController.getOriginalUrl);
router.get("/all", ShortnerController.getAllUrls);

export default router;