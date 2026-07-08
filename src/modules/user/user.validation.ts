import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      message: "Role must be CUSTOMER or TECHNICIAN",
    }),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    experience: z.union([z.string(), z.number()]).optional(),
    skills: z.array(z.string()).optional(),
    hourlyRate: z.number().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }),
  }),
});

export const userValidation = {
  registerValidationSchema,
  loginValidationSchema,
};