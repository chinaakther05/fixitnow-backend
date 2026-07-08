import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CreateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (customerId: string, payload: CreateReviewPayload) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: { review: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot review this booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(httpStatus.BAD_REQUEST, "You can only review a completed booking");
  }

  if (booking.review) {
    throw new AppError(httpStatus.CONFLICT, "Review already submitted for this booking");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
  }

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      customerId,
      technicianId: booking.technicianId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId: booking.technicianId },
  });

  if (technicianProfile) {
    const allReviews = await prisma.review.findMany({
      where: { technicianId: booking.technicianId },
    });

    const totalReviews = allReviews.length;
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await prisma.technicianProfile.update({
      where: { userId: booking.technicianId },
      data: {
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
      },
    });
  }

  return review;
};

export const reviewService = {
  createReviewIntoDB,
};