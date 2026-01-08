import express from 'express';
import ConfigServer from './api/config/serverConfig.js';
import appointmentRouter from './api/routes/AppointmentRoutes.js';
import reviewerRouter from './api/routes/ReviewerRoutes.js';
import ConnectDatabase from './api/database/connectDatabase.js';
import "./bin/www";

const app = express();
const port = 5000;

ConfigServer(app);
ConnectDatabase();

//Appointment
app.use("/api/appointment", appointmentRouter);

//Reviewer
app.use("/api/reviewer", reviewerRouter);

app.listen(port, () => {
    console.log("App listening at port " + port);
})