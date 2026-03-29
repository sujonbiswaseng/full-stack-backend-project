import { z } from "zod";
import { EventType, PricingType } from "../../../generated/prisma/enums";
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

export const EventStatusEnum =z.enum([
  "DRAFT",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]).default('UPCOMING');


export const CreateEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categories: EventCategoryEnum,
  date: z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  })
  .transform((val) => new Date(val).toISOString()),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(3, "Venue is required"),
  image: z.string().url("Image URL is required"),
  visibility:z.enum(EventType).default("PUBLIC"),
  priceType:z.enum( PricingType).default("FREE"),
  fee: z.coerce.number().default(0).optional(),
  status: EventStatusEnum.default("UPCOMING"),
  is_featured: z.boolean().optional().default(false),
})
export const UpdateEventSchema = CreateEventSchema.partial();

