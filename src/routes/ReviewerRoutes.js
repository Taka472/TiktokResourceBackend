import { Router } from "express";
import reviewerController from "../controllers/ReviewerController.js";

const router = Router();

//Add new reviewer
router.post("/addReviewer", reviewerController.addReviewer);

export default router;