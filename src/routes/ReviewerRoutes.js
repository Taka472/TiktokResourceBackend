import { Router } from "express";
import reviewerController from "../controllers/ReviewerController.js";

const router = Router();

//Add new reviewer
router.post("/addReviewer", reviewerController.addReviewer);

//Get reviewer id for appointment creation
router.get("/getReviewerId", reviewerController.getTiktokerName);

//Get all reviewer info
router.get("/getAllReviewer", reviewerController.getAllReviewer);

//Get reviewer by Id
router.get("/getReviewerById/:id", reviewerController.getReviewerById);

//Update reviewer
router.put("/updateReviewer/:id", reviewerController.updateReviewer);

//Delete reviewer
router.delete("/deleteReviewer/:id", reviewerController.deleteReviewer);

export default router;