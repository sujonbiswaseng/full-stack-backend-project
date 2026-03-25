import { z } from "zod";
import { EventType } from "../../../generated/prisma/enums";
const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;

export const EventCategoryEnum = z.enum([
  "BIRTHDAY",
  "WEDDING",
  "ANNIVERSARY",
  "REUNION",

  "SEMINAR",
  "WORKSHOP",
  "CONFERENCE",
  "CAREER_FAIR",

  "MEETING",
  "NETWORKING",
  "PRODUCT_LAUNCH",
  "STARTUP_EVENT",

  "CONCERT",
  "PARTY",
  "FESTIVAL",
  "MOVIE_NIGHT",

  "TOURNAMENT",
  "FITNESS",
  "YOGA",

  "CHARITY",
  "COMMUNITY",
  "RELIGIOUS",

  "ART",
  "PHOTOGRAPHY",
  "FASHION_SHOW",

  "GAMING",
  "FOOD_EVENT",
  "TRAVEL_MEETUP",
]);

export const EventStatusEnum = z.enum([
  "DRAFT",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]).default("UPCOMING");

export const CreateEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: EventStatusEnum,
  categories: EventCategoryEnum,
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val).toISOString()),
  time: z.string().regex(timeRegex, "Time must be in HH:MM format"),

  venue: z.string().min(3, "Venue must be at least 3 characters"),

  visibility: z.enum([EventType.PRIVATE, EventType.PUBLIC]),

  fee: z.number().min(0, "Fee cannot be negative").optional(),
}).strict();
export const UpdateEventSchema = CreateEventSchema.partial();