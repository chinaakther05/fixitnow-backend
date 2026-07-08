import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/category.route";
import { technicianRoutes } from "./modules/technician/technician.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { serviceRoutes } from "./modules/service/service.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";



const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials : true,
}))


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/", (req : Request, res : Response) => {
    res.send("Hello World!");
})

//app.post();

app.use("/api/users", userRoutes)
app.use("/api", categoryRoutes);
app.use("/api", technicianRoutes);
app.use("/api", bookingRoutes);
app.use("/api", serviceRoutes);
app.use("/api", paymentRoutes)
app.use("/api", reviewRoutes);
app.use("/api", adminRoutes);



app.use(globalErrorHandler);
export default app;