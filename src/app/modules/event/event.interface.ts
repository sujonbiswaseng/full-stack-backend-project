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
  fee?: number;
}

export interface IUpdateEventInput {
  title?: string;
  description?: string;
  date?: string;   
  time?: string;      
  venue?: string;
  categories?:EventCategory;
  status?:EventStatus;
  visibility?: "PUBLIC" | "PRIVATE" ;
  fee?: number;
}