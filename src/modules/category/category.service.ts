import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { CreateCategoryPayload } from "./category.interface";

const createCategoryIntoDB = async (payload: CreateCategoryPayload) => {
  const isExist = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "Category with this name already exists");
  }

  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return categories;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};