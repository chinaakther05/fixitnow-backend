import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const updateProfile = catchAsync(async (req, res) => {
  const userId = (req as any).user.userId;
  const result = await technicianService.updateProfileIntoDB(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(async (req, res) => {
  const userId = (req as any).user.userId;
  const result = await technicianService.updateAvailabilityIntoDB(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: result,
  });
});

export const technicianController = {
  updateProfile,
  updateAvailability,
};