import z from "zod";
import { createUserSchema } from "./auth.validation";

// createUSEr
export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
  status?: "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING";
}