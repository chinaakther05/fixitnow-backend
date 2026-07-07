import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CreateServicePayload } from "./service.interface";

const createServiceIntoDB = async (userId: string, payload: CreateServicePayload) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const service = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      categoryId: payload.categoryId,
      title: payload.title,
      description: payload.description,
      price: payload.price,
    },
  });

  return service;
};

const getAllServicesFromDB = async (filters: { categoryId?: string; minPrice?: string; maxPrice?: string }) => {
  const { categoryId, minPrice, maxPrice } = filters;

  const services = await prisma.service.findMany({
    where: {
      ...(categoryId && { categoryId }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: Number(minPrice) }),
              ...(maxPrice && { lte: Number(maxPrice) }),
            },
          }
        : {}),
    },
    include: {
      technician: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return services;
};

export const serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
};