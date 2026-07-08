import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await serviceService.createServiceIntoDB(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.getAllServicesFromDB(req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result,
  });
});

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.getAllTechniciansFromDB(req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians retrieved successfully",
    data: result,
  });
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.getTechnicianByIdFromDB(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician retrieved successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  getAllServices,
  getAllTechnicians,
  getTechnicianById
};