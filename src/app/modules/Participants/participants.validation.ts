import z from "zod";

export const createParticipantSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "BANNED"]).optional(),       // optional, default PENDING
  paymentStatus: z.enum(["PENDING", "SUCCESS", "FAILED", "FREE"]).optional(),    // optional, default PENDING
});