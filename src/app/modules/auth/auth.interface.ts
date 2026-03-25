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

export interface ILoginUser{
    email: string;
    password: string;
}

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}