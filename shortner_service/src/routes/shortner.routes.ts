import { Router } from "express";
import { ShortnerController } from "../controllers/shortner.controller";

const router = Router();

router.post("/create",ShortnerController.createShortUrl);

export default router;