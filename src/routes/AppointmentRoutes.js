import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";

const router = Router();

//Get data for dashboard
router.get('/getDashboard', appointmentController.getDashboard);

//Get today appointment
router.get('/getTodayAppointment', appointmentController.getAppointmentToday);

//Add new appointment
router.post('/addAppointment', appointmentController.addAppointment);

//Get week appointment
router.get('/getWeekAppointment', appointmentController.getWeekAppointment);

//Update appointment
router.put("/updateAppointment/:id", appointmentController.updateAppointment);

export default router;