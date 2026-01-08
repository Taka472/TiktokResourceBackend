import express from 'express';
import ConfigServer from './src/config/serverConfig.js';
import appointmentRouter from './src/routes/AppointmentRoutes.js';
import reviewerRouter from './src/routes/ReviewerRoutes.js';
import ConnectDatabase from './src/database/connectDatabase.js';

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