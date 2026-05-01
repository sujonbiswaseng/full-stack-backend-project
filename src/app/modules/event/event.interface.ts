import { EventCategory, EventStatus, EventType } from "../../../generated/prisma/enums";
export interface ICreateEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  visibility: EventType;
  categories:EventCategory;
  priceType?: "FREE" | "PAID";
  status:EventStatus;
  images:string[];
  fee?: number;
}

export interface IUpdateEventInput {
  is_featured?: boolean;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  images?: string[];
  categories?: EventCategory;
  priceType?: "FREE" | "PAID";
  status?: EventStatus;
  visibility?: "PUBLIC" | "PRIVATE";
  fee?: number;
  search?:string;
  createdAt?: string;
}

export type IEventQuery = Partial<IUpdateEventInput>;