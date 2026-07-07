import { ErrorRequestHandler, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (error, req : Request, res : Response, next : any) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.log(error); // debugging এর জন্য console এও দেখাবে

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails: error instanceof Error ? error.message : error,
  });
};

export default globalErrorHandler;