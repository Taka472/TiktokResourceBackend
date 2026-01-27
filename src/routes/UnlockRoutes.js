import { Router } from "express";
import { unlockController } from "../controllers/UnlockController.js";

const router = Router();

//Unlock
router.post("/unlock", unlockController.unlock);

export default router;