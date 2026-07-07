import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { jwtUtils } from "../utils/jwt";
import config from "../config";

export const authMiddleware = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; // "Bearer <token>"

    if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const token = authHeader.split(" ")[1]; // "Bearer" বাদ দিয়ে token নেওয়া

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }

    const decoded = verifiedToken.data as { userId: string; role: string };

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
    }

    // req এ user info বসিয়ে দাও, পরের controller এ ব্যবহার হবে
    (req as any).user = decoded;

    next();
  };
};