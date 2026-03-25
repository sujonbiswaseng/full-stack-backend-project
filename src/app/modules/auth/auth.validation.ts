import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED", "PENDING"]).default("ACTIVE"),
});