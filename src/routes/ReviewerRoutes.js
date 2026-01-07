import { Router } from "express";
import reviewerController from "../controllers/ReviewerController.js";

const router = Router();

//Add new reviewer
router.post("/addReviewer", reviewerController.addReviewer);

//Get reviewer basic info for appointment creation
router.get("/getReviewerId", reviewerController.getTiktokerName);

//Test parse follower
router.post("/parseFollowers", reviewerController.testParseFollower);

export default router;