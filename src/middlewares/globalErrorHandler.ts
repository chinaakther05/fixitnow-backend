import { ErrorRequestHandler, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: any) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = "Something went wrong";
  let errorDetails: any = error instanceof Error ? error.message : error;

  // Zod Validation Error হলে আলাদাভাবে handle করো
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error";
    errorDetails = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.log(error);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;