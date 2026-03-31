import { z } from "zod";
import { createInvitationSchema, updateInvitationSchema } from "./invitations.validation";
export interface ICreateInvitationInput extends z.infer<typeof createInvitationSchema> {}
export interface IUpdateInvitationInput extends z.infer<typeof updateInvitationSchema> {}

export interface IInvitationInput {
  inviteeId: string[];
  message?: string;
  eventId: string,
}