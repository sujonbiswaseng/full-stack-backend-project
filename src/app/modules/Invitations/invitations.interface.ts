import { z } from "zod";
import { createInvitationSchema } from "./invitations.validation";
export interface ICreateInvitationInput extends z.infer<typeof createInvitationSchema> {}
export interface IUpdateInvitationInput {
  status?: "PENDING" | "ACCEPTED" | "DECLINED";
  message?: string;
}


export interface IInvitationInput {
  inviteeId: string[];
  message?: string;
  eventId: string,
}