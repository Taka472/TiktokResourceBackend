import { Router } from "express";
import paymentController from "../controllers/PaymentController";

const router = Router()

//Get payable appointment
router.get("/getCanPayAppointment", paymentController.getCanPayAppointment);

//Create payment
router.post("/createPayment", paymentController.createPayment);

//Upload payment image
router.post("/uploadPaymentImage/:id", uploadPaymentImage.single("image"), paymentController.uploadPaymentImage);

export default router;