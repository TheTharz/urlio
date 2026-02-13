import { Router } from "express";
import { ShortnerController } from "../controllers/shortner.controller";

const router = Router();

router.post("/create",ShortnerController.createShortUrl);
router.post("/originalurl",ShortnerController.getOriginalUrl);

export default router;