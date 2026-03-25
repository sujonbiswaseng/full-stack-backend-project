import { EventType } from "../../../generated/prisma/enums";
export interface ICreateEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility: EventType;
  fee?: number;
}