import { ErrorRequestHandler, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: any) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;  
  let message: string = "Something went wrong";

  if (error instanceof AppError) {
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
    errorDetails: error instanceof Error ? error.message : error,
  });
};

export default globalErrorHandler;