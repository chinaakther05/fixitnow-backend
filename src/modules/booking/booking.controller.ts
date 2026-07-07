import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user.userId;
  const result = await bookingService.createBookingIntoDB(customerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = (req as any).user;
  const result = await bookingService.getMyBookingsFromDB(userId, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = (req as any).user;
  const result = await bookingService.getBookingByIdFromDB(
    req.params.id as string,
    userId,
    role
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking details retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const technicianId = (req as any).user.userId;
  const result = await bookingService.updateBookingStatusIntoDB(
    req.params.id as string,
    technicianId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking status updated successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};