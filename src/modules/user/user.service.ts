import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { Role } from "../../../generated/prisma/enums";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    profileImage,
    bio,
    experience,
    skills,
    hourlyRate,
  } = payload;

  // ০. Admin role ব্লক করো — নিরাপত্তার জন্য
  if (role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot register as an admin");
  }

  // ১. Duplicate email check
  const isUserExist = await prisma.user.findUnique({ where: { email } });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
  }

  // ২. Password hash
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  // ৩. User তৈরি
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      profileImage,
    },
  });

  // ৪. Technician হলে profile তৈরি
  if (role === "TECHNICIAN") {
    await prisma.technicianProfile.create({
      data: {
        userId: createdUser.id,
        bio: bio || null,
        experience: experience ? Number(experience) : null,
        skills: skills || [],
        hourlyRate: hourlyRate || null,
      },
    });
  }

  // ৫. Password ছাড়া user ফেরত পাঠানো
  const user = await prisma.user.findUnique({
    where: { id: createdUser.id },
    omit: { password: true },
    include: { technicianProfile: true },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
};