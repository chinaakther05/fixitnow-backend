import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UpdateUserStatusPayload } from "./admin.interface";

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    include: { technicianProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

const updateUserStatusIntoDB = async (userId: string, payload: UpdateUserStatusPayload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot change status of an admin");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    omit: { password: true },
  });

  return updatedUser;
};

const getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true } },
      technician: { select: { id: true, name: true, email: true } },
      category: true,
      payment: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllBookingsFromDB,
};