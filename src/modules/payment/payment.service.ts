import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CreatePaymentPayload } from "./payment.interface";
import { v4 as uuidv4 } from "uuid";


const createPaymentIntoDB = async (customerId: string, payload: CreatePaymentPayload) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: { payment: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot pay for this booking");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking must be accepted before payment");
  }

  if (booking.payment) {
    throw new AppError(httpStatus.CONFLICT, "Payment already exists for this booking");
  }

  // Stripe Checkout Session 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Booking Payment - ${booking.id}`,
          },
          unit_amount: Math.round(booking.totalAmount * 100), // Stripe cents এ নেয়
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.APP_URL}/payment-success?bookingId=${booking.id}`,
    cancel_url: `${process.env.APP_URL}/payment-cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
    },
  });

  const transactionId = uuidv4();

 const payment = await prisma.payment.create({
  data: {
    bookingId: booking.id,
    transactionId,
    amount: booking.totalAmount,
    method: "card",        
    provider: "STRIPE",     
    status: "PENDING",
  },
});

  return {
    payment,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

// Payment Confirm 
const confirmPaymentIntoDB = async (transactionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { booking: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "COMPLETED") {
    throw new AppError(httpStatus.CONFLICT, "Payment already confirmed");
  }

  const updatedPayment = await prisma.payment.update({
    where: { transactionId },
    data: {
      status: "COMPLETED",
      paidAt: new Date(),
    },
  });

  // Booking status 
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { status: "PAID" },
  });

  return updatedPayment;
};

const getMyPaymentsFromDB = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: { customerId: userId },
    },
    include: {
      booking: {
        include: {
          technician: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

const getPaymentByIdFromDB = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { booking: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot access this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};