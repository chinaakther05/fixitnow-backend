
import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  profileImage?: string;
  bio?: string;
  experience?: string;
  skills?: string[];
  hourlyRate?: number;
}


export interface LoginUserPayload {
  email: string;
  password: string;
}