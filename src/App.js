import express from 'express';
import ConfigServer from './config/serverConfig.js';
import appointmentRouter from './routes/AppointmentRoutes.js';
import ConnectDatabase from './database/connectDatabase.js';

const app = express();
const port = 5000;

ConfigServer(app);
ConnectDatabase();

//Appointment
app.use("/api/appointment", appointmentRouter);

app.listen(port, () => {
    console.log("App listening at port " + port);
})