import { z } from "zod";

export const createInvitationSchema = z.object({
  inviteeId: z.array(z.string()),
  message: z.string().optional(),
  eventId:z.string()
});

export const updateInvitationSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional(),
  message: z.string().optional(),
});