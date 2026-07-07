import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // নিজে response না পাঠিয়ে, error টা globalErrorHandler এ পাস করে দিবে
    }
  };
};