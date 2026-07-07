import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/bookings", authMiddleware("CUSTOMER"), bookingController.createBooking);
router.get("/bookings", authMiddleware(), bookingController.getMyBookings);
router.get("/bookings/:id", authMiddleware(), bookingController.getBookingById);
router.get("/technician/bookings", authMiddleware("TECHNICIAN"), bookingController.getMyBookings);
router.patch("/technician/bookings/:id", authMiddleware("TECHNICIAN"), bookingController.updateBookingStatus);

export const bookingRoutes = router;