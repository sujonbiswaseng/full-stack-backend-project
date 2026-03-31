import { z } from "zod";

export const createInvitationSchema = z.object({
  inviteeId: z.array(z.string()),
  message: z.string().optional(),
});

export const updateInvitationSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional(),
  paymentStatus: z.enum(["PENDING", "FREE", "FAILED","SUCCESS"]).optional(),
});