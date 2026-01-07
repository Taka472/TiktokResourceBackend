import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";

const router = Router();

//Get data for dashboard
router.get('/getDashboard', appointmentController.getDashboard);

//Get today appointment
router.get('/getTodayAppointment', appointmentController.getAppointmentToday);

export default router;