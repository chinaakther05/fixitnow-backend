import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateUserStatusIntoDB(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllBookingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
};