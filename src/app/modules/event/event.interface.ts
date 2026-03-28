import { EventCategory, EventStatus, EventType } from "../../../generated/prisma/enums";
export interface ICreateEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility: EventType;
  categories:EventCategory;
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
  status?: EventStatus;
  visibility?: "PUBLIC" | "PRIVATE" | "PUBLIC_PAID" | "PRIVATE_PAID";
  fee?: number;
}

export type IEventQuery = Partial<IUpdateEventInput>;