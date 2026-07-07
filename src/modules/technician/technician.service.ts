import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UpdateTechnicianProfilePayload, UpdateAvailabilityPayload } from "./technician.interface";

const updateProfileIntoDB = async (userId: string, payload: UpdateTechnicianProfilePayload) => {
  const existingProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const updatedProfile = await prisma.technicianProfile.update({
    where: { userId },
    data: payload,
  });

  return updatedProfile;
};

const updateAvailabilityIntoDB = async (userId: string, payload: UpdateAvailabilityPayload) => {
  const existingProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const updatedProfile = await prisma.technicianProfile.update({
    where: { userId },
    data: { availability: payload.availability },
  });

  return updatedProfile;
};

export const technicianService = {
  updateProfileIntoDB,
  updateAvailabilityIntoDB,
};