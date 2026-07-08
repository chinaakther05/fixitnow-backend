import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { Role } from "../../../generated/prisma/enums";
import { LoginUserPayload, RegisterUserPayload } from "./user.interface";
import { jwtUtils } from "../../utils/jwt";

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

  //  Admin role 
  if (role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot register as an admin");
  }

  //  Duplicate email check
  const isUserExist = await prisma.user.findUnique({ where: { email } });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
  }

  //  Password hash
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  //  User 
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

  //  Technician 
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

 
  const user = await prisma.user.findUnique({
    where: { id: createdUser.id },
    omit: { password: true },
    include: { technicianProfile: true },
  });

  return user;
};


const loginUserFromDB = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not active");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

 const accessToken = jwtUtils.createToken(
  jwtPayload,
  config.jwt_access_secret,
  config.jwt_access_expires_in as any   
);

  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};


const getMeFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: { technicianProfile: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};



export const userService = {
  registerUserIntoDB,
  loginUserFromDB,
  getMeFromDB,
};