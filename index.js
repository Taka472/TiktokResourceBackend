import express from 'express';
import ConfigServer from './src/config/serverConfig.js';
import appointmentRouter from './src/routes/AppointmentRoutes.js';
import reviewerRouter from './src/routes/ReviewerRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import unlockRouter from './src/routes/UnlockRoutes.js';
import statisticRouter from './src/routes/StatisticRoutes.js';
import ConnectDatabase from './src/database/connectDatabase.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

ConfigServer(app);
ConnectDatabase();

//Appointment
app.use("/api/appointment", appointmentRouter);

//Reviewer
app.use("/api/reviewer", reviewerRouter);

//Payment
app.use("/api/payment", paymentRouter);

//Unlock
app.use("/api", unlockRouter);

//Statistic
app.use("/api/statistic", statisticRouter);

app.listen(port, () => {
    console.log("App listening at port " + port);
})