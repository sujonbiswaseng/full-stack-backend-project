import { z } from "zod";
import { EventType } from "../../../generated/prisma/enums";

export const CreateEventSchema = z.object({
     title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
      .transform((val) => new Date(val).toISOString()),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),

    venue: z.string().min(3, "Venue must be at least 3 characters"),

    visibility:z.enum([EventType.PRIVATE,EventType.PUBLIC]),

    fee: z.number().min(0, "Fee cannot be negative").optional()})
