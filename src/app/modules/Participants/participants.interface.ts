import z from "zod";
import { createParticipantSchema } from "./participants.validation";

// interface for Participants module
export interface ICreateParticipantInput extends z.infer<typeof createParticipantSchema>{}