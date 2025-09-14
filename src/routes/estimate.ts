import { Router, Request, Response } from "express";
import { estimateController } from "../controllers/estimateController";

const router = Router();

router.post("/", estimateController);

export default router;