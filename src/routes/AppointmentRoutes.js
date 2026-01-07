import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";

const router = Router();

//Get data for dashboard
router.get('/getDashboard', appointmentController.getDashboard);

//Get today appointment
router.get('/getTodayAppointment', appointmentController.getAppointmentToday);

//Add new appointment
router.post('/addAppointment', appointmentController.addAppointment);

export default router;