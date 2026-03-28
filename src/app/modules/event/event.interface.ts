import { EventCategory, EventStatus, EventType } from "../../../generated/prisma/enums";
export interface ICreateEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility: EventType;
  categories:EventCategory;
  priceType?: "FREE" | "PAID";
  status:EventStatus;
  image:string;
  fee?: number;
}

export interface IUpdateEventInput {
  is_featured?: boolean;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  image?: string;
  categories?: EventCategory;
  priceType?: "FREE" | "PAID";
  status?: EventStatus;
  visibility?: "PUBLIC" | "PRIVATE";
  fee?: number;
}

export type IEventQuery = Partial<IUpdateEventInput>;