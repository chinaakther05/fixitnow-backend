import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CreateBookingPayload, UpdateBookingStatusPayload } from "./booking.interface";




const createBookingIntoDB = async (customerId: string, payload: CreateBookingPayload) => {
  
  const technician = await prisma.user.findUnique({
    where: { id: payload.technicianId },
  });

  if (!technician || technician.role !== "TECHNICIAN") {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      categoryId: payload.categoryId,
      serviceId: payload.serviceId,
      scheduledDate: new Date(payload.scheduledDate),
      address: payload.address,
      notes: payload.notes,
      totalAmount: payload.totalAmount,
      status: "REQUESTED",
    },
  });

  return booking;
};


const getMyBookingsFromDB = async (userId: string, role: string) => {
  const whereCondition =
    role === "TECHNICIAN" ? { technicianId: userId } : { customerId: userId };

  const bookings = await prisma.booking.findMany({
    where: whereCondition,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      technician: { select: { id: true, name: true, email: true, phone: true } },
      category: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};


const getBookingByIdFromDB = async (bookingId: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      technician: { select: { id: true, name: true, email: true, phone: true } },
      category: true,
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

 
  if (
    role !== "ADMIN" &&
    booking.customerId !== userId &&
    booking.technicianId !== userId
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot access this booking");
  }

  return booking;
};


const updateBookingStatusIntoDB = async (
  bookingId: string,
  technicianId: string,
  payload: UpdateBookingStatusPayload
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.technicianId !== technicianId) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot update this booking");
  }

  // Status transition validation (basic)
  const validTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED"],
    PAID: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
  };

  const allowedNext = validTransitions[booking.status] || [];

  if (!allowedNext.includes(payload.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${booking.status} to ${payload.status}`
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: payload.status },
  });

  return updatedBooking;
};

export const bookingService = {
  createBookingIntoDB,
  getMyBookingsFromDB,
  getBookingByIdFromDB,
  updateBookingStatusIntoDB,
};