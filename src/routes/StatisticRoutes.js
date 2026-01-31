import { Router } from "express";
import { statisticController } from "../controllers/StatisticController.js";

const router = Router();

//Get monthly statistic
router.get("/getStatistic", statisticController.getMonthlyStatistic);

export default router;