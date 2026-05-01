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
export const getEventsSchema = z.object({
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid ISO date string",
    })
    .transform((val) => new Date(val).toISOString())
});

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
  location: z.string().min(3, "Location is required"),
  images:z.array(z.any()),
  visibility:z.enum(EventType).default("PUBLIC"),
  priceType:z.enum( PricingType).default("FREE"),
  fee: z.coerce.number().optional(),
  status: EventStatusEnum.default("UPCOMING"),
  is_featured: z.boolean().optional().default(false),
})
export const UpdateEventSchema = CreateEventSchema.partial();

