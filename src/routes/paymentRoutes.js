import { Router } from "express";
import paymentController from "../controllers/PaymentController";
import uploadPaymentImage from "../middlewares/uploadPaymentImage";

const router = Router()

//Get payable appointment
router.get("/getPaymentDashboard", paymentController.getPaymentDashboard);

//Create payment
router.post("/createPayment", paymentController.createPayment);

//Upload payment image
router.post("/uploadPaymentImage/:id", uploadPaymentImage.single("image"), paymentController.uploadPaymentImage);

//Upload deposite image
router.post("/uploadDepositPayment/:id", uploadPaymentImage.single("image"), paymentController.uploadDepositImage);

export default router;