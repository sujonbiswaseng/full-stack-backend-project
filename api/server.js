var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express6, { Response } from "express";

// src/app/middleware/notFound.ts
import status from "http-status";
var notFound = (req, res) => {
  return res.status(status.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

// src/app/config/env.ts
import dotenv from "dotenv";
import status2 from "http-status";

// src/app/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "FRONTEND_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status2.INTERNAL_SERVER_ERROR,
        `Server configuration error: The required environment variable "${variable}" is not set. Verify your .env file or deployment environment settings.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": `model User {
  id            String     @id @default(uuid())
  name          String
  email         String     @unique
  role          Role       @default(USER)
  status        UserStatus @default(ACTIVE)
  phone         String?
  image         String
  isDeleted     Boolean    @default(false)
  deletedAt     DateTime?
  bgimage       String?
  isActive      Boolean    @default(false)
  emailVerified Boolean    @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // relations
  events              Event[]        @relation("UserEvents")
  participants        Participant[]
  reviews             Review[]
  payments            Payment[]
  notifications       Notification[]
  invitationsSent     Invitation[]   @relation("Inviter")
  invitationsReceived Invitation[]   @relation("Invitee")

  sessions Session[]
  accounts Account[]

  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}

enum Role {
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
  DELETED
}

enum EventType {
  PUBLIC
  PRIVATE
}

enum PricingType {
  FREE
  PAID
}

enum EventStatus {
  DRAFT
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum EventCategory {
  // \u{1F389} Personal Events
  BIRTHDAY
  WEDDING
  ANNIVERSARY
  REUNION

  // \u{1F393} Education & Career
  SEMINAR
  WORKSHOP
  CONFERENCE
  CAREER_FAIR

  // \u{1F4BC} Business
  MEETING
  NETWORKING
  PRODUCT_LAUNCH
  STARTUP_EVENT

  // \u{1F3AD} Entertainment
  CONCERT
  PARTY
  FESTIVAL
  MOVIE_NIGHT

  // \u{1F3C3} Sports & Health
  TOURNAMENT
  FITNESS
  YOGA

  // \u{1F64F} Social & Community
  CHARITY
  COMMUNITY
  RELIGIOUS

  // \u{1F3A8} Creative
  ART
  PHOTOGRAPHY
  FASHION_SHOW

  // \u{1F3AE} Others
  GAMING
  FOOD_EVENT
  TRAVEL_MEETUP
}

enum ParticipantStatus {
  PENDING
  APPROVED
  REJECTED
  BANNED
}

enum PaymentStatus {
  PAID
  UNPAID
  FREE
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
}

enum ReviewStatus {
  APPROVED
  REJECTED
}

model Event {
  id          String        @id @default(uuid())
  title       String
  description String
  date        DateTime
  time        String
  venue       String
  image       String
  visibility  EventType     @default(PUBLIC)
  priceType   PricingType   @default(FREE)
  status      EventStatus   @default(UPCOMING)
  is_featured Boolean?      @default(false)
  categories  EventCategory
  fee         Float         @default(0)
  organizerId String
  organizer   User          @relation("UserEvents", fields: [organizerId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  // relations
  participants Participant[]
  invitations  Invitation[]
  reviews      Review[]
  payments     Payment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Invitation {
  id String @id @default(uuid())

  eventId       String
  inviterId     String
  inviteeId     String
  notifications Notification[]

  event   Event @relation(fields: [eventId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  inviter User  @relation("Inviter", fields: [inviterId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  invitee User  @relation("Invitee", fields: [inviteeId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  status    InvitationStatus @default(PENDING)
  createdAt DateTime         @default(now())
}

model Notification {
  id           String      @id @default(cuid())
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String
  message      String
  type         String // 'INVITATION', 'INFO', etc
  read         Boolean     @default(false)
  invitation   Invitation? @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  invitationId String?
  createdAt    DateTime    @default(now())
}

model Participant {
  id String @id @default(uuid())

  userId  String
  eventId String

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  status        ParticipantStatus @default(PENDING)
  paymentStatus PaymentStatus     @default(UNPAID)
  payment       Payment?

  joinedAt DateTime @default(now())
}

model Payment {
  id String @id @default(uuid())

  userId             String
  eventId            String
  stripeEventId      String? @unique
  transactionId      String? @unique @db.Uuid()
  paymentGatewayData Json?

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  amount        Float
  status        PaymentStatus @default(UNPAID)
  participantId String        @unique
  participant   Participant   @relation(fields: [participantId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
}

model Review {
  id String @id @default(uuid())

  userId   String
  eventId  String
  rating   Int
  comment  String
  parentId String?
  status   ReviewStatus @default(APPROVED)

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  event   Event    @relation(fields: [eventId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  parent  Review?  @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  replies Review[] @relation("reviewsReply")

  createdAt DateTime @default(now())
}

generator client {
  provider = "prisma-client"
  output   = "../../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"events","kind":"object","type":"Event","relationName":"UserEvents"},{"name":"participants","kind":"object","type":"Participant","relationName":"ParticipantToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"invitationsSent","kind":"object","type":"Invitation","relationName":"Inviter"},{"name":"invitationsReceived","kind":"object","type":"Invitation","relationName":"Invitee"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"time","kind":"scalar","type":"String"},{"name":"venue","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"EventType"},{"name":"priceType","kind":"enum","type":"PricingType"},{"name":"status","kind":"enum","type":"EventStatus"},{"name":"is_featured","kind":"scalar","type":"Boolean"},{"name":"categories","kind":"enum","type":"EventCategory"},{"name":"fee","kind":"scalar","type":"Float"},{"name":"organizerId","kind":"scalar","type":"String"},{"name":"organizer","kind":"object","type":"User","relationName":"UserEvents"},{"name":"participants","kind":"object","type":"Participant","relationName":"EventToParticipant"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"EventToInvitation"},{"name":"reviews","kind":"object","type":"Review","relationName":"EventToReview"},{"name":"payments","kind":"object","type":"Payment","relationName":"EventToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"inviterId","kind":"scalar","type":"String"},{"name":"inviteeId","kind":"scalar","type":"String"},{"name":"notifications","kind":"object","type":"Notification","relationName":"InvitationToNotification"},{"name":"event","kind":"object","type":"Event","relationName":"EventToInvitation"},{"name":"inviter","kind":"object","type":"User","relationName":"Inviter"},{"name":"invitee","kind":"object","type":"User","relationName":"Invitee"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"read","kind":"scalar","type":"Boolean"},{"name":"invitation","kind":"object","type":"Invitation","relationName":"InvitationToNotification"},{"name":"invitationId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Participant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ParticipantToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToParticipant"},{"name":"status","kind":"enum","type":"ParticipantStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"payment","kind":"object","type":"Payment","relationName":"ParticipantToPayment"},{"name":"joinedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"participantId","kind":"scalar","type":"String"},{"name":"participant","kind":"object","type":"Participant","relationName":"ParticipantToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organizer","user","event","participant","payment","participants","invitation","notifications","inviter","invitee","_count","invitations","parent","replies","reviews","payments","events","invitationsSent","invitationsReceived","sessions","accounts","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.createManyAndReturn","Event.updateOne","Event.updateMany","Event.updateManyAndReturn","Event.upsertOne","Event.deleteOne","Event.deleteMany","_avg","_sum","Event.groupBy","Event.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Participant.findUnique","Participant.findUniqueOrThrow","Participant.findFirst","Participant.findFirstOrThrow","Participant.findMany","Participant.createOne","Participant.createMany","Participant.createManyAndReturn","Participant.updateOne","Participant.updateMany","Participant.updateManyAndReturn","Participant.upsertOne","Participant.deleteOne","Participant.deleteMany","Participant.groupBy","Participant.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","userId","eventId","rating","comment","parentId","ReviewStatus","status","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","stripeEventId","transactionId","paymentGatewayData","amount","PaymentStatus","participantId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","ParticipantStatus","paymentStatus","joinedAt","message","type","read","invitationId","inviterId","inviteeId","InvitationStatus","title","description","date","time","venue","image","EventType","visibility","PricingType","priceType","EventStatus","is_featured","EventCategory","categories","fee","organizerId","updatedAt","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","Role","role","UserStatus","phone","isDeleted","deletedAt","bgimage","isActive","emailVerified","every","some","none","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "mQZboAEaCAAA7wIAIAoAAPICACARAADwAgAgEgAA8QIAIBMAAO4CACAUAADzAgAgFQAA8wIAIBYAAPQCACAXAAD1AgAgwAEAAOgCADDBAQAAPQAQwgEAAOgCADDDAQEAAAABygEAAOoCkgIiywFAANsCACHyAQEA2gIAIf0BQADbAgAhjQIBANoCACGOAgEAAAABkAIAAOkCkAIikgIBAOsCACGTAiAA7AIAIZQCQADtAgAhlQIBAOsCACGWAiAA7AIAIZcCIADsAgAhAQAAAAEAIBgDAAD3AgAgCAAA7wIAIA4AAPMCACARAADwAgAgEgAA8QIAIMABAACMAwAwwQEAAAMAEMIBAACMAwAwwwEBANoCACHKAQAAjwP4ASLLAUAA2wIAIe0BAQDaAgAh7gEBANoCACHvAUAA2wIAIfABAQDaAgAh8QEBANoCACHyAQEA2gIAIfQBAACNA_QBIvYBAACOA_YBIvgBIACQAwAh-gEAAJED-gEi-wEIAPsCACH8AQEA2gIAIf0BQADbAgAhBgMAALUFACAIAACuBQAgDgAAsgUAIBEAAK8FACASAACwBQAg-AEAAJIDACAYAwAA9wIAIAgAAO8CACAOAADzAgAgEQAA8AIAIBIAAPECACDAAQAAjAMAMMEBAAADABDCAQAAjAMAMMMBAQAAAAHKAQAAjwP4ASLLAUAA2wIAIe0BAQDaAgAh7gEBANoCACHvAUAA2wIAIfABAQDaAgAh8QEBANoCACHyAQEA2gIAIfQBAACNA_QBIvYBAACOA_YBIvgBIACQAwAh-gEAAJED-gEi-wEIAPsCACH8AQEA2gIAIf0BQADbAgAhAwAAAAMAIAEAAAQAMAIAAAUAIAwEAAD3AgAgBQAA_QIAIAcAAIsDACDAAQAAiQMAMMEBAAAHABDCAQAAiQMAMMMBAQDaAgAhxAEBANoCACHFAQEA2gIAIcoBAACKA-QBIuQBAAD8AtwBIuUBQADbAgAhAwQAALUFACAFAAC2BQAgBwAAugUAIAwEAAD3AgAgBQAA_QIAIAcAAIsDACDAAQAAiQMAMMEBAAAHABDCAQAAiQMAMMMBAQAAAAHEAQEA2gIAIcUBAQDaAgAhygEAAIoD5AEi5AEAAPwC3AEi5QFAANsCACEDAAAABwAgAQAACAAwAgAACQAgEAQAAPcCACAFAAD9AgAgBgAA_gIAIMABAAD5AgAwwQEAAAsAEMIBAAD5AgAwwwEBANoCACHEAQEA2gIAIcUBAQDaAgAhygEAAPwC3AEiywFAANsCACHXAQEA6wIAIdgBAQCHAwAh2QEAAPoCACDaAQgA-wIAIdwBAQDaAgAhAQAAAAsAIA0FAAD9AgAgCgAA8gIAIAsAAPcCACAMAAD3AgAgwAEAAIUDADDBAQAADQAQwgEAAIUDADDDAQEA2gIAIcUBAQDaAgAhygEAAIYD7QEiywFAANsCACHqAQEA2gIAIesBAQDaAgAhBAUAALYFACAKAACxBQAgCwAAtQUAIAwAALUFACANBQAA_QIAIAoAAPICACALAAD3AgAgDAAA9wIAIMABAACFAwAwwQEAAA0AEMIBAACFAwAwwwEBAAAAAcUBAQDaAgAhygEAAIYD7QEiywFAANsCACHqAQEA2gIAIesBAQDaAgAhAwAAAA0AIAEAAA4AMAIAAA8AIAwEAAD3AgAgCQAAhAMAIMABAACDAwAwwQEAABEAEMIBAACDAwAwwwEBANoCACHEAQEA2gIAIcsBQADbAgAh5gEBANoCACHnAQEA2gIAIegBIADsAgAh6QEBAOsCACEDBAAAtQUAIAkAALkFACDpAQAAkgMAIAwEAAD3AgAgCQAAhAMAIMABAACDAwAwwQEAABEAEMIBAACDAwAwwwEBAAAAAcQBAQDaAgAhywFAANsCACHmAQEA2gIAIecBAQDaAgAh6AEgAOwCACHpAQEA6wIAIQMAAAARACABAAASADACAAATACABAAAADQAgAQAAABEAIA8EAAD3AgAgBQAA_QIAIA8AAIIDACAQAADwAgAgwAEAAP8CADDBAQAAFwAQwgEAAP8CADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHGAQIAgAMAIccBAQDaAgAhyAEBAOsCACHKAQAAgQPKASLLAUAA2wIAIQUEAAC1BQAgBQAAtgUAIA8AALgFACAQAACvBQAgyAEAAJIDACAPBAAA9wIAIAUAAP0CACAPAACCAwAgEAAA8AIAIMABAAD_AgAwwQEAABcAEMIBAAD_AgAwwwEBAAAAAcQBAQDaAgAhxQEBANoCACHGAQIAgAMAIccBAQDaAgAhyAEBAOsCACHKAQAAgQPKASLLAUAA2wIAIQMAAAAXACABAAAYADACAAAZACABAAAAFwAgAwAAABcAIAEAABgAMAIAABkAIAEAAAAXACAGBAAAtQUAIAUAALYFACAGAAC3BQAg1wEAAJIDACDYAQAAkgMAINkBAACSAwAgEAQAAPcCACAFAAD9AgAgBgAA_gIAIMABAAD5AgAwwQEAAAsAEMIBAAD5AgAwwwEBAAAAAcQBAQDaAgAhxQEBANoCACHKAQAA_ALcASLLAUAA2wIAIdcBAQAAAAHYAQEAAAAB2QEAAPoCACDaAQgA-wIAIdwBAQAAAAEDAAAACwAgAQAAHgAwAgAAHwAgAQAAAAcAIAEAAAANACABAAAAFwAgAQAAAAsAIAMAAAAHACABAAAIADACAAAJACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAAAsAIAEAAB4AMAIAAB8AIAMAAAARACABAAASADACAAATACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAwEAAD3AgAgwAEAAPgCADDBAQAAKwAQwgEAAPgCADDDAQEA2gIAIcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYACQADbAgAhigIBANoCACGLAgEA6wIAIYwCAQDrAgAhAwQAALUFACCLAgAAkgMAIIwCAACSAwAgDAQAAPcCACDAAQAA-AIAMMEBAAArABDCAQAA-AIAMMMBAQAAAAHEAQEA2gIAIcsBQADbAgAh_QFAANsCACGAAkAA2wIAIYoCAQAAAAGLAgEA6wIAIYwCAQDrAgAhAwAAACsAIAEAACwAMAIAAC0AIBEEAAD3AgAgwAEAAPYCADDBAQAALwAQwgEAAPYCADDDAQEA2gIAIcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYECAQDaAgAhggIBANoCACGDAgEA6wIAIYQCAQDrAgAhhQIBAOsCACGGAkAA7QIAIYcCQADtAgAhiAIBAOsCACGJAgEA6wIAIQgEAAC1BQAggwIAAJIDACCEAgAAkgMAIIUCAACSAwAghgIAAJIDACCHAgAAkgMAIIgCAACSAwAgiQIAAJIDACARBAAA9wIAIMABAAD2AgAwwQEAAC8AEMIBAAD2AgAwwwEBAAAAAcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYECAQDaAgAhggIBANoCACGDAgEA6wIAIYQCAQDrAgAhhQIBAOsCACGGAkAA7QIAIYcCQADtAgAhiAIBAOsCACGJAgEA6wIAIQMAAAAvACABAAAwADACAAAxACABAAAAAwAgAQAAAAcAIAEAAAAXACABAAAACwAgAQAAABEAIAEAAAANACABAAAADQAgAQAAACsAIAEAAAAvACABAAAAAQAgGggAAO8CACAKAADyAgAgEQAA8AIAIBIAAPECACATAADuAgAgFAAA8wIAIBUAAPMCACAWAAD0AgAgFwAA9QIAIMABAADoAgAwwQEAAD0AEMIBAADoAgAwwwEBANoCACHKAQAA6gKSAiLLAUAA2wIAIfIBAQDaAgAh_QFAANsCACGNAgEA2gIAIY4CAQDaAgAhkAIAAOkCkAIikgIBAOsCACGTAiAA7AIAIZQCQADtAgAhlQIBAOsCACGWAiAA7AIAIZcCIADsAgAhDAgAAK4FACAKAACxBQAgEQAArwUAIBIAALAFACATAACtBQAgFAAAsgUAIBUAALIFACAWAACzBQAgFwAAtAUAIJICAACSAwAglAIAAJIDACCVAgAAkgMAIAMAAAA9ACABAAA-ADACAAABACADAAAAPQAgAQAAPgAwAgAAAQAgAwAAAD0AIAEAAD4AMAIAAAEAIBcIAAClBQAgCgAAqAUAIBEAAKYFACASAACnBQAgEwAApAUAIBQAAKkFACAVAACqBQAgFgAAqwUAIBcAAKwFACDDAQEAAAABygEAAACSAgLLAUAAAAAB8gEBAAAAAf0BQAAAAAGNAgEAAAABjgIBAAAAAZACAAAAkAICkgIBAAAAAZMCIAAAAAGUAkAAAAABlQIBAAAAAZYCIAAAAAGXAiAAAAABAR0AAEIAIA7DAQEAAAABygEAAACSAgLLAUAAAAAB8gEBAAAAAf0BQAAAAAGNAgEAAAABjgIBAAAAAZACAAAAkAICkgIBAAAAAZMCIAAAAAGUAkAAAAABlQIBAAAAAZYCIAAAAAGXAiAAAAABAR0AAEQAMAEdAABEADAXCAAAwgQAIAoAAMUEACARAADDBAAgEgAAxAQAIBMAAMEEACAUAADGBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgwwEBAJgDACHKAQAAwASSAiLLAUAAmwMAIfIBAQCYAwAh_QFAAJsDACGNAgEAmAMAIY4CAQCYAwAhkAIAAL8EkAIikgIBAJwDACGTAiAA0AMAIZQCQAC0BAAhlQIBAJwDACGWAiAA0AMAIZcCIADQAwAhAgAAAAEAIB0AAEcAIA7DAQEAmAMAIcoBAADABJICIssBQACbAwAh8gEBAJgDACH9AUAAmwMAIY0CAQCYAwAhjgIBAJgDACGQAgAAvwSQAiKSAgEAnAMAIZMCIADQAwAhlAJAALQEACGVAgEAnAMAIZYCIADQAwAhlwIgANADACECAAAAPQAgHQAASQAgAgAAAD0AIB0AAEkAIAMAAAABACAkAABCACAlAABHACABAAAAAQAgAQAAAD0AIAYNAAC8BAAgKgAAvgQAICsAAL0EACCSAgAAkgMAIJQCAACSAwAglQIAAJIDACARwAEAAOECADDBAQAAUAAQwgEAAOECADDDAQEAoQIAIcoBAADjApICIssBQAClAgAh8gEBAKECACH9AUAApQIAIY0CAQChAgAhjgIBAKECACGQAgAA4gKQAiKSAgEAowIAIZMCIADBAgAhlAJAAN0CACGVAgEAowIAIZYCIADBAgAhlwIgAMECACEDAAAAPQAgAQAATwAwKQAAUAAgAwAAAD0AIAEAAD4AMAIAAAEAIAEAAAAtACABAAAALQAgAwAAACsAIAEAACwAMAIAAC0AIAMAAAArACABAAAsADACAAAtACADAAAAKwAgAQAALAAwAgAALQAgCQQAALsEACDDAQEAAAABxAEBAAAAAcsBQAAAAAH9AUAAAAABgAJAAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAQEdAABYACAIwwEBAAAAAcQBAQAAAAHLAUAAAAAB_QFAAAAAAYACQAAAAAGKAgEAAAABiwIBAAAAAYwCAQAAAAEBHQAAWgAwAR0AAFoAMAkEAAC6BAAgwwEBAJgDACHEAQEAmAMAIcsBQACbAwAh_QFAAJsDACGAAkAAmwMAIYoCAQCYAwAhiwIBAJwDACGMAgEAnAMAIQIAAAAtACAdAABdACAIwwEBAJgDACHEAQEAmAMAIcsBQACbAwAh_QFAAJsDACGAAkAAmwMAIYoCAQCYAwAhiwIBAJwDACGMAgEAnAMAIQIAAAArACAdAABfACACAAAAKwAgHQAAXwAgAwAAAC0AICQAAFgAICUAAF0AIAEAAAAtACABAAAAKwAgBQ0AALcEACAqAAC5BAAgKwAAuAQAIIsCAACSAwAgjAIAAJIDACALwAEAAOACADDBAQAAZgAQwgEAAOACADDDAQEAoQIAIcQBAQChAgAhywFAAKUCACH9AUAApQIAIYACQAClAgAhigIBAKECACGLAgEAowIAIYwCAQCjAgAhAwAAACsAIAEAAGUAMCkAAGYAIAMAAAArACABAAAsADACAAAtACABAAAAMQAgAQAAADEAIAMAAAAvACABAAAwADACAAAxACADAAAALwAgAQAAMAAwAgAAMQAgAwAAAC8AIAEAADAAMAIAADEAIA4EAAC2BAAgwwEBAAAAAcQBAQAAAAHLAUAAAAAB_QFAAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABiQIBAAAAAQEdAABuACANwwEBAAAAAcQBAQAAAAHLAUAAAAAB_QFAAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABiQIBAAAAAQEdAABwADABHQAAcAAwDgQAALUEACDDAQEAmAMAIcQBAQCYAwAhywFAAJsDACH9AUAAmwMAIYECAQCYAwAhggIBAJgDACGDAgEAnAMAIYQCAQCcAwAhhQIBAJwDACGGAkAAtAQAIYcCQAC0BAAhiAIBAJwDACGJAgEAnAMAIQIAAAAxACAdAABzACANwwEBAJgDACHEAQEAmAMAIcsBQACbAwAh_QFAAJsDACGBAgEAmAMAIYICAQCYAwAhgwIBAJwDACGEAgEAnAMAIYUCAQCcAwAhhgJAALQEACGHAkAAtAQAIYgCAQCcAwAhiQIBAJwDACECAAAALwAgHQAAdQAgAgAAAC8AIB0AAHUAIAMAAAAxACAkAABuACAlAABzACABAAAAMQAgAQAAAC8AIAoNAACxBAAgKgAAswQAICsAALIEACCDAgAAkgMAIIQCAACSAwAghQIAAJIDACCGAgAAkgMAIIcCAACSAwAgiAIAAJIDACCJAgAAkgMAIBDAAQAA3AIAMMEBAAB8ABDCAQAA3AIAMMMBAQChAgAhxAEBAKECACHLAUAApQIAIf0BQAClAgAhgQIBAKECACGCAgEAoQIAIYMCAQCjAgAhhAIBAKMCACGFAgEAowIAIYYCQADdAgAhhwJAAN0CACGIAgEAowIAIYkCAQCjAgAhAwAAAC8AIAEAAHsAMCkAAHwAIAMAAAAvACABAAAwADACAAAxACAJwAEAANkCADDBAQAAggEAEMIBAADZAgAwwwEBAAAAAcsBQADbAgAh_QFAANsCACH-AQEA2gIAIf8BAQDaAgAhgAJAANsCACEBAAAAfwAgAQAAAH8AIAnAAQAA2QIAMMEBAACCAQAQwgEAANkCADDDAQEA2gIAIcsBQADbAgAh_QFAANsCACH-AQEA2gIAIf8BAQDaAgAhgAJAANsCACEAAwAAAIIBACABAACDAQAwAgAAfwAgAwAAAIIBACABAACDAQAwAgAAfwAgAwAAAIIBACABAACDAQAwAgAAfwAgBsMBAQAAAAHLAUAAAAAB_QFAAAAAAf4BAQAAAAH_AQEAAAABgAJAAAAAAQEdAACHAQAgBsMBAQAAAAHLAUAAAAAB_QFAAAAAAf4BAQAAAAH_AQEAAAABgAJAAAAAAQEdAACJAQAwAR0AAIkBADAGwwEBAJgDACHLAUAAmwMAIf0BQACbAwAh_gEBAJgDACH_AQEAmAMAIYACQACbAwAhAgAAAH8AIB0AAIwBACAGwwEBAJgDACHLAUAAmwMAIf0BQACbAwAh_gEBAJgDACH_AQEAmAMAIYACQACbAwAhAgAAAIIBACAdAACOAQAgAgAAAIIBACAdAACOAQAgAwAAAH8AICQAAIcBACAlAACMAQAgAQAAAH8AIAEAAACCAQAgAw0AAK4EACAqAACwBAAgKwAArwQAIAnAAQAA2AIAMMEBAACVAQAQwgEAANgCADDDAQEAoQIAIcsBQAClAgAh_QFAAKUCACH-AQEAoQIAIf8BAQChAgAhgAJAAKUCACEDAAAAggEAIAEAAJQBADApAACVAQAgAwAAAIIBACABAACDAQAwAgAAfwAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAVAwAAqQQAIAgAAKoEACAOAACrBAAgEQAArAQAIBIAAK0EACDDAQEAAAABygEAAAD4AQLLAUAAAAAB7QEBAAAAAe4BAQAAAAHvAUAAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB9AEAAAD0AQL2AQAAAPYBAvgBIAAAAAH6AQAAAPoBAvsBCAAAAAH8AQEAAAAB_QFAAAAAAQEdAACdAQAgEMMBAQAAAAHKAQAAAPgBAssBQAAAAAHtAQEAAAAB7gEBAAAAAe8BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAH0AQAAAPQBAvYBAAAA9gEC-AEgAAAAAfoBAAAA-gEC-wEIAAAAAfwBAQAAAAH9AUAAAAABAR0AAJ8BADABHQAAnwEAMBUDAAD3AwAgCAAA-AMAIA4AAPkDACARAAD6AwAgEgAA-wMAIMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIQIAAAAFACAdAACiAQAgEMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIQIAAAADACAdAACkAQAgAgAAAAMAIB0AAKQBACADAAAABQAgJAAAnQEAICUAAKIBACABAAAABQAgAQAAAAMAIAYNAADtAwAgKgAA8AMAICsAAO8DACBsAADuAwAgbQAA8QMAIPgBAACSAwAgE8ABAADIAgAwwQEAAKsBABDCAQAAyAIAMMMBAQChAgAhygEAAMsC-AEiywFAAKUCACHtAQEAoQIAIe4BAQChAgAh7wFAAKUCACHwAQEAoQIAIfEBAQChAgAh8gEBAKECACH0AQAAyQL0ASL2AQAAygL2ASL4ASAAzAIAIfoBAADNAvoBIvsBCAC1AgAh_AEBAKECACH9AUAApQIAIQMAAAADACABAACqAQAwKQAAqwEAIAMAAAADACABAAAEADACAAAFACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAoFAADqAwAgCgAA6QMAIAsAAOsDACAMAADsAwAgwwEBAAAAAcUBAQAAAAHKAQAAAO0BAssBQAAAAAHqAQEAAAAB6wEBAAAAAQEdAACzAQAgBsMBAQAAAAHFAQEAAAABygEAAADtAQLLAUAAAAAB6gEBAAAAAesBAQAAAAEBHQAAtQEAMAEdAAC1AQAwCgUAANoDACAKAADZAwAgCwAA2wMAIAwAANwDACDDAQEAmAMAIcUBAQCYAwAhygEAANgD7QEiywFAAJsDACHqAQEAmAMAIesBAQCYAwAhAgAAAA8AIB0AALgBACAGwwEBAJgDACHFAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACHrAQEAmAMAIQIAAAANACAdAAC6AQAgAgAAAA0AIB0AALoBACADAAAADwAgJAAAswEAICUAALgBACABAAAADwAgAQAAAA0AIAMNAADVAwAgKgAA1wMAICsAANYDACAJwAEAAMQCADDBAQAAwQEAEMIBAADEAgAwwwEBAKECACHFAQEAoQIAIcoBAADFAu0BIssBQAClAgAh6gEBAKECACHrAQEAoQIAIQMAAAANACABAADAAQAwKQAAwQEAIAMAAAANACABAAAOADACAAAPACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIAkEAADTAwAgCQAA1AMAIMMBAQAAAAHEAQEAAAABywFAAAAAAeYBAQAAAAHnAQEAAAAB6AEgAAAAAekBAQAAAAEBHQAAyQEAIAfDAQEAAAABxAEBAAAAAcsBQAAAAAHmAQEAAAAB5wEBAAAAAegBIAAAAAHpAQEAAAABAR0AAMsBADABHQAAywEAMAEAAAANACAJBAAA0QMAIAkAANIDACDDAQEAmAMAIcQBAQCYAwAhywFAAJsDACHmAQEAmAMAIecBAQCYAwAh6AEgANADACHpAQEAnAMAIQIAAAATACAdAADPAQAgB8MBAQCYAwAhxAEBAJgDACHLAUAAmwMAIeYBAQCYAwAh5wEBAJgDACHoASAA0AMAIekBAQCcAwAhAgAAABEAIB0AANEBACACAAAAEQAgHQAA0QEAIAEAAAANACADAAAAEwAgJAAAyQEAICUAAM8BACABAAAAEwAgAQAAABEAIAQNAADNAwAgKgAAzwMAICsAAM4DACDpAQAAkgMAIArAAQAAwAIAMMEBAADZAQAQwgEAAMACADDDAQEAoQIAIcQBAQChAgAhywFAAKUCACHmAQEAoQIAIecBAQChAgAh6AEgAMECACHpAQEAowIAIQMAAAARACABAADYAQAwKQAA2QEAIAMAAAARACABAAASADACAAATACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAkEAADKAwAgBQAAywMAIAcAAMwDACDDAQEAAAABxAEBAAAAAcUBAQAAAAHKAQAAAOQBAuQBAAAA3AEC5QFAAAAAAQEdAADhAQAgBsMBAQAAAAHEAQEAAAABxQEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABAR0AAOMBADABHQAA4wEAMAkEAADCAwAgBQAAwwMAIAcAAMQDACDDAQEAmAMAIcQBAQCYAwAhxQEBAJgDACHKAQAAwQPkASLkAQAAtwPcASLlAUAAmwMAIQIAAAAJACAdAADmAQAgBsMBAQCYAwAhxAEBAJgDACHFAQEAmAMAIcoBAADBA-QBIuQBAAC3A9wBIuUBQACbAwAhAgAAAAcAIB0AAOgBACACAAAABwAgHQAA6AEAIAMAAAAJACAkAADhAQAgJQAA5gEAIAEAAAAJACABAAAABwAgAw0AAL4DACAqAADAAwAgKwAAvwMAIAnAAQAAvAIAMMEBAADvAQAQwgEAALwCADDDAQEAoQIAIcQBAQChAgAhxQEBAKECACHKAQAAvQLkASLkAQAAtgLcASLlAUAApQIAIQMAAAAHACABAADuAQAwKQAA7wEAIAMAAAAHACABAAAIADACAAAJACABAAAAHwAgAQAAAB8AIAMAAAALACABAAAeADACAAAfACADAAAACwAgAQAAHgAwAgAAHwAgAwAAAAsAIAEAAB4AMAIAAB8AIA0EAAC7AwAgBQAAvAMAIAYAAL0DACDDAQEAAAABxAEBAAAAAcUBAQAAAAHKAQAAANwBAssBQAAAAAHXAQEAAAAB2AEBAAAAAdkBgAAAAAHaAQgAAAAB3AEBAAAAAQEdAAD3AQAgCsMBAQAAAAHEAQEAAAABxQEBAAAAAcoBAAAA3AECywFAAAAAAdcBAQAAAAHYAQEAAAAB2QGAAAAAAdoBCAAAAAHcAQEAAAABAR0AAPkBADABHQAA-QEAMA0EAAC4AwAgBQAAuQMAIAYAALoDACDDAQEAmAMAIcQBAQCYAwAhxQEBAJgDACHKAQAAtwPcASLLAUAAmwMAIdcBAQCcAwAh2AEBAJwDACHZAYAAAAAB2gEIALYDACHcAQEAmAMAIQIAAAAfACAdAAD8AQAgCsMBAQCYAwAhxAEBAJgDACHFAQEAmAMAIcoBAAC3A9wBIssBQACbAwAh1wEBAJwDACHYAQEAnAMAIdkBgAAAAAHaAQgAtgMAIdwBAQCYAwAhAgAAAAsAIB0AAP4BACACAAAACwAgHQAA_gEAIAMAAAAfACAkAAD3AQAgJQAA_AEAIAEAAAAfACABAAAACwAgCA0AALEDACAqAAC0AwAgKwAAswMAIGwAALIDACBtAAC1AwAg1wEAAJIDACDYAQAAkgMAINkBAACSAwAgDcABAACyAgAwwQEAAIUCABDCAQAAsgIAMMMBAQChAgAhxAEBAKECACHFAQEAoQIAIcoBAAC2AtwBIssBQAClAgAh1wEBAKMCACHYAQEAswIAIdkBAAC0AgAg2gEIALUCACHcAQEAoQIAIQMAAAALACABAACEAgAwKQAAhQIAIAMAAAALACABAAAeADACAAAfACABAAAAGQAgAQAAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAwEAACtAwAgBQAArgMAIA8AALADACAQAACvAwAgwwEBAAAAAcQBAQAAAAHFAQEAAAABxgECAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABAR0AAI0CACAIwwEBAAAAAcQBAQAAAAHFAQEAAAABxgECAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABAR0AAI8CADABHQAAjwIAMAEAAAAXACAMBAAAnQMAIAUAAJ4DACAPAACfAwAgEAAAoAMAIMMBAQCYAwAhxAEBAJgDACHFAQEAmAMAIcYBAgCZAwAhxwEBAJgDACHIAQEAnAMAIcoBAACaA8oBIssBQACbAwAhAgAAABkAIB0AAJMCACAIwwEBAJgDACHEAQEAmAMAIcUBAQCYAwAhxgECAJkDACHHAQEAmAMAIcgBAQCcAwAhygEAAJoDygEiywFAAJsDACECAAAAFwAgHQAAlQIAIAIAAAAXACAdAACVAgAgAQAAABcAIAMAAAAZACAkAACNAgAgJQAAkwIAIAEAAAAZACABAAAAFwAgBg0AAJMDACAqAACWAwAgKwAAlQMAIGwAAJQDACBtAACXAwAgyAEAAJIDACALwAEAAKACADDBAQAAnQIAEMIBAACgAgAwwwEBAKECACHEAQEAoQIAIcUBAQChAgAhxgECAKICACHHAQEAoQIAIcgBAQCjAgAhygEAAKQCygEiywFAAKUCACEDAAAAFwAgAQAAnAIAMCkAAJ0CACADAAAAFwAgAQAAGAAwAgAAGQAgC8ABAACgAgAwwQEAAJ0CABDCAQAAoAIAMMMBAQChAgAhxAEBAKECACHFAQEAoQIAIcYBAgCiAgAhxwEBAKECACHIAQEAowIAIcoBAACkAsoBIssBQAClAgAhDg0AAKcCACAqAACxAgAgKwAAsQIAIMwBAQAAAAHNAQEAAAAEzgEBAAAABM8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAsAIAIdQBAQAAAAHVAQEAAAAB1gEBAAAAAQ0NAACnAgAgKgAApwIAICsAAKcCACBsAACvAgAgbQAApwIAIMwBAgAAAAHNAQIAAAAEzgECAAAABM8BAgAAAAHQAQIAAAAB0QECAAAAAdIBAgAAAAHTAQIArgIAIQ4NAACsAgAgKgAArQIAICsAAK0CACDMAQEAAAABzQEBAAAABc4BAQAAAAXPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAKsCACHUAQEAAAAB1QEBAAAAAdYBAQAAAAEHDQAApwIAICoAAKoCACArAACqAgAgzAEAAADKAQLNAQAAAMoBCM4BAAAAygEI0wEAAKkCygEiCw0AAKcCACAqAACoAgAgKwAAqAIAIMwBQAAAAAHNAUAAAAAEzgFAAAAABM8BQAAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHTAUAApgIAIQsNAACnAgAgKgAAqAIAICsAAKgCACDMAUAAAAABzQFAAAAABM4BQAAAAATPAUAAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAAB0wFAAKYCACEIzAECAAAAAc0BAgAAAATOAQIAAAAEzwECAAAAAdABAgAAAAHRAQIAAAAB0gECAAAAAdMBAgCnAgAhCMwBQAAAAAHNAUAAAAAEzgFAAAAABM8BQAAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHTAUAAqAIAIQcNAACnAgAgKgAAqgIAICsAAKoCACDMAQAAAMoBAs0BAAAAygEIzgEAAADKAQjTAQAAqQLKASIEzAEAAADKAQLNAQAAAMoBCM4BAAAAygEI0wEAAKoCygEiDg0AAKwCACAqAACtAgAgKwAArQIAIMwBAQAAAAHNAQEAAAAFzgEBAAAABc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAqwIAIdQBAQAAAAHVAQEAAAAB1gEBAAAAAQjMAQIAAAABzQECAAAABc4BAgAAAAXPAQIAAAAB0AECAAAAAdEBAgAAAAHSAQIAAAAB0wECAKwCACELzAEBAAAAAc0BAQAAAAXOAQEAAAAFzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQCtAgAh1AEBAAAAAdUBAQAAAAHWAQEAAAABDQ0AAKcCACAqAACnAgAgKwAApwIAIGwAAK8CACBtAACnAgAgzAECAAAAAc0BAgAAAATOAQIAAAAEzwECAAAAAdABAgAAAAHRAQIAAAAB0gECAAAAAdMBAgCuAgAhCMwBCAAAAAHNAQgAAAAEzgEIAAAABM8BCAAAAAHQAQgAAAAB0QEIAAAAAdIBCAAAAAHTAQgArwIAIQ4NAACnAgAgKgAAsQIAICsAALECACDMAQEAAAABzQEBAAAABM4BAQAAAATPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBALACACHUAQEAAAAB1QEBAAAAAdYBAQAAAAELzAEBAAAAAc0BAQAAAATOAQEAAAAEzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQCxAgAh1AEBAAAAAdUBAQAAAAHWAQEAAAABDcABAACyAgAwwQEAAIUCABDCAQAAsgIAMMMBAQChAgAhxAEBAKECACHFAQEAoQIAIcoBAAC2AtwBIssBQAClAgAh1wEBAKMCACHYAQEAswIAIdkBAAC0AgAg2gEIALUCACHcAQEAoQIAIQsNAACsAgAgKgAArQIAICsAAK0CACDMAQEAAAABzQEBAAAABc4BAQAAAAXPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBALsCACEPDQAArAIAICoAALoCACArAAC6AgAgzAGAAAAAAc8BgAAAAAHQAYAAAAAB0QGAAAAAAdIBgAAAAAHTAYAAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AGAAAAAAeEBgAAAAAHiAYAAAAABDQ0AAKcCACAqAACvAgAgKwAArwIAIGwAAK8CACBtAACvAgAgzAEIAAAAAc0BCAAAAATOAQgAAAAEzwEIAAAAAdABCAAAAAHRAQgAAAAB0gEIAAAAAdMBCAC5AgAhBw0AAKcCACAqAAC4AgAgKwAAuAIAIMwBAAAA3AECzQEAAADcAQjOAQAAANwBCNMBAAC3AtwBIgcNAACnAgAgKgAAuAIAICsAALgCACDMAQAAANwBAs0BAAAA3AEIzgEAAADcAQjTAQAAtwLcASIEzAEAAADcAQLNAQAAANwBCM4BAAAA3AEI0wEAALgC3AEiDQ0AAKcCACAqAACvAgAgKwAArwIAIGwAAK8CACBtAACvAgAgzAEIAAAAAc0BCAAAAATOAQgAAAAEzwEIAAAAAdABCAAAAAHRAQgAAAAB0gEIAAAAAdMBCAC5AgAhDMwBgAAAAAHPAYAAAAAB0AGAAAAAAdEBgAAAAAHSAYAAAAAB0wGAAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABgAAAAAHhAYAAAAAB4gGAAAAAAQsNAACsAgAgKgAArQIAICsAAK0CACDMAQEAAAABzQEBAAAABc4BAQAAAAXPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBALsCACEJwAEAALwCADDBAQAA7wEAEMIBAAC8AgAwwwEBAKECACHEAQEAoQIAIcUBAQChAgAhygEAAL0C5AEi5AEAALYC3AEi5QFAAKUCACEHDQAApwIAICoAAL8CACArAAC_AgAgzAEAAADkAQLNAQAAAOQBCM4BAAAA5AEI0wEAAL4C5AEiBw0AAKcCACAqAAC_AgAgKwAAvwIAIMwBAAAA5AECzQEAAADkAQjOAQAAAOQBCNMBAAC-AuQBIgTMAQAAAOQBAs0BAAAA5AEIzgEAAADkAQjTAQAAvwLkASIKwAEAAMACADDBAQAA2QEAEMIBAADAAgAwwwEBAKECACHEAQEAoQIAIcsBQAClAgAh5gEBAKECACHnAQEAoQIAIegBIADBAgAh6QEBAKMCACEFDQAApwIAICoAAMMCACArAADDAgAgzAEgAAAAAdMBIADCAgAhBQ0AAKcCACAqAADDAgAgKwAAwwIAIMwBIAAAAAHTASAAwgIAIQLMASAAAAAB0wEgAMMCACEJwAEAAMQCADDBAQAAwQEAEMIBAADEAgAwwwEBAKECACHFAQEAoQIAIcoBAADFAu0BIssBQAClAgAh6gEBAKECACHrAQEAoQIAIQcNAACnAgAgKgAAxwIAICsAAMcCACDMAQAAAO0BAs0BAAAA7QEIzgEAAADtAQjTAQAAxgLtASIHDQAApwIAICoAAMcCACArAADHAgAgzAEAAADtAQLNAQAAAO0BCM4BAAAA7QEI0wEAAMYC7QEiBMwBAAAA7QECzQEAAADtAQjOAQAAAO0BCNMBAADHAu0BIhPAAQAAyAIAMMEBAACrAQAQwgEAAMgCADDDAQEAoQIAIcoBAADLAvgBIssBQAClAgAh7QEBAKECACHuAQEAoQIAIe8BQAClAgAh8AEBAKECACHxAQEAoQIAIfIBAQChAgAh9AEAAMkC9AEi9gEAAMoC9gEi-AEgAMwCACH6AQAAzQL6ASL7AQgAtQIAIfwBAQChAgAh_QFAAKUCACEHDQAApwIAICoAANcCACArAADXAgAgzAEAAAD0AQLNAQAAAPQBCM4BAAAA9AEI0wEAANYC9AEiBw0AAKcCACAqAADVAgAgKwAA1QIAIMwBAAAA9gECzQEAAAD2AQjOAQAAAPYBCNMBAADUAvYBIgcNAACnAgAgKgAA0wIAICsAANMCACDMAQAAAPgBAs0BAAAA-AEIzgEAAAD4AQjTAQAA0gL4ASIFDQAArAIAICoAANECACArAADRAgAgzAEgAAAAAdMBIADQAgAhBw0AAKcCACAqAADPAgAgKwAAzwIAIMwBAAAA-gECzQEAAAD6AQjOAQAAAPoBCNMBAADOAvoBIgcNAACnAgAgKgAAzwIAICsAAM8CACDMAQAAAPoBAs0BAAAA-gEIzgEAAAD6AQjTAQAAzgL6ASIEzAEAAAD6AQLNAQAAAPoBCM4BAAAA-gEI0wEAAM8C-gEiBQ0AAKwCACAqAADRAgAgKwAA0QIAIMwBIAAAAAHTASAA0AIAIQLMASAAAAAB0wEgANECACEHDQAApwIAICoAANMCACArAADTAgAgzAEAAAD4AQLNAQAAAPgBCM4BAAAA-AEI0wEAANIC-AEiBMwBAAAA-AECzQEAAAD4AQjOAQAAAPgBCNMBAADTAvgBIgcNAACnAgAgKgAA1QIAICsAANUCACDMAQAAAPYBAs0BAAAA9gEIzgEAAAD2AQjTAQAA1AL2ASIEzAEAAAD2AQLNAQAAAPYBCM4BAAAA9gEI0wEAANUC9gEiBw0AAKcCACAqAADXAgAgKwAA1wIAIMwBAAAA9AECzQEAAAD0AQjOAQAAAPQBCNMBAADWAvQBIgTMAQAAAPQBAs0BAAAA9AEIzgEAAAD0AQjTAQAA1wL0ASIJwAEAANgCADDBAQAAlQEAEMIBAADYAgAwwwEBAKECACHLAUAApQIAIf0BQAClAgAh_gEBAKECACH_AQEAoQIAIYACQAClAgAhCcABAADZAgAwwQEAAIIBABDCAQAA2QIAMMMBAQDaAgAhywFAANsCACH9AUAA2wIAIf4BAQDaAgAh_wEBANoCACGAAkAA2wIAIQvMAQEAAAABzQEBAAAABM4BAQAAAATPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBALECACHUAQEAAAAB1QEBAAAAAdYBAQAAAAEIzAFAAAAAAc0BQAAAAATOAUAAAAAEzwFAAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAAdMBQACoAgAhEMABAADcAgAwwQEAAHwAEMIBAADcAgAwwwEBAKECACHEAQEAoQIAIcsBQAClAgAh_QFAAKUCACGBAgEAoQIAIYICAQChAgAhgwIBAKMCACGEAgEAowIAIYUCAQCjAgAhhgJAAN0CACGHAkAA3QIAIYgCAQCjAgAhiQIBAKMCACELDQAArAIAICoAAN8CACArAADfAgAgzAFAAAAAAc0BQAAAAAXOAUAAAAAFzwFAAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAAdMBQADeAgAhCw0AAKwCACAqAADfAgAgKwAA3wIAIMwBQAAAAAHNAUAAAAAFzgFAAAAABc8BQAAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHTAUAA3gIAIQjMAUAAAAABzQFAAAAABc4BQAAAAAXPAUAAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAAB0wFAAN8CACELwAEAAOACADDBAQAAZgAQwgEAAOACADDDAQEAoQIAIcQBAQChAgAhywFAAKUCACH9AUAApQIAIYACQAClAgAhigIBAKECACGLAgEAowIAIYwCAQCjAgAhEcABAADhAgAwwQEAAFAAEMIBAADhAgAwwwEBAKECACHKAQAA4wKSAiLLAUAApQIAIfIBAQChAgAh_QFAAKUCACGNAgEAoQIAIY4CAQChAgAhkAIAAOICkAIikgIBAKMCACGTAiAAwQIAIZQCQADdAgAhlQIBAKMCACGWAiAAwQIAIZcCIADBAgAhBw0AAKcCACAqAADnAgAgKwAA5wIAIMwBAAAAkAICzQEAAACQAgjOAQAAAJACCNMBAADmApACIgcNAACnAgAgKgAA5QIAICsAAOUCACDMAQAAAJICAs0BAAAAkgIIzgEAAACSAgjTAQAA5AKSAiIHDQAApwIAICoAAOUCACArAADlAgAgzAEAAACSAgLNAQAAAJICCM4BAAAAkgII0wEAAOQCkgIiBMwBAAAAkgICzQEAAACSAgjOAQAAAJICCNMBAADlApICIgcNAACnAgAgKgAA5wIAICsAAOcCACDMAQAAAJACAs0BAAAAkAIIzgEAAACQAgjTAQAA5gKQAiIEzAEAAACQAgLNAQAAAJACCM4BAAAAkAII0wEAAOcCkAIiGggAAO8CACAKAADyAgAgEQAA8AIAIBIAAPECACATAADuAgAgFAAA8wIAIBUAAPMCACAWAAD0AgAgFwAA9QIAIMABAADoAgAwwQEAAD0AEMIBAADoAgAwwwEBANoCACHKAQAA6gKSAiLLAUAA2wIAIfIBAQDaAgAh_QFAANsCACGNAgEA2gIAIY4CAQDaAgAhkAIAAOkCkAIikgIBAOsCACGTAiAA7AIAIZQCQADtAgAhlQIBAOsCACGWAiAA7AIAIZcCIADsAgAhBMwBAAAAkAICzQEAAACQAgjOAQAAAJACCNMBAADnApACIgTMAQAAAJICAs0BAAAAkgIIzgEAAACSAgjTAQAA5QKSAiILzAEBAAAAAc0BAQAAAAXOAQEAAAAFzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQCtAgAh1AEBAAAAAdUBAQAAAAHWAQEAAAABAswBIAAAAAHTASAAwwIAIQjMAUAAAAABzQFAAAAABc4BQAAAAAXPAUAAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAAB0wFAAN8CACEDmAIAAAMAIJkCAAADACCaAgAAAwAgA5gCAAAHACCZAgAABwAgmgIAAAcAIAOYAgAAFwAgmQIAABcAIJoCAAAXACADmAIAAAsAIJkCAAALACCaAgAACwAgA5gCAAARACCZAgAAEQAgmgIAABEAIAOYAgAADQAgmQIAAA0AIJoCAAANACADmAIAACsAIJkCAAArACCaAgAAKwAgA5gCAAAvACCZAgAALwAgmgIAAC8AIBEEAAD3AgAgwAEAAPYCADDBAQAALwAQwgEAAPYCADDDAQEA2gIAIcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYECAQDaAgAhggIBANoCACGDAgEA6wIAIYQCAQDrAgAhhQIBAOsCACGGAkAA7QIAIYcCQADtAgAhiAIBAOsCACGJAgEA6wIAIRwIAADvAgAgCgAA8gIAIBEAAPACACASAADxAgAgEwAA7gIAIBQAAPMCACAVAADzAgAgFgAA9AIAIBcAAPUCACDAAQAA6AIAMMEBAAA9ABDCAQAA6AIAMMMBAQDaAgAhygEAAOoCkgIiywFAANsCACHyAQEA2gIAIf0BQADbAgAhjQIBANoCACGOAgEA2gIAIZACAADpApACIpICAQDrAgAhkwIgAOwCACGUAkAA7QIAIZUCAQDrAgAhlgIgAOwCACGXAiAA7AIAIZsCAAA9ACCcAgAAPQAgDAQAAPcCACDAAQAA-AIAMMEBAAArABDCAQAA-AIAMMMBAQDaAgAhxAEBANoCACHLAUAA2wIAIf0BQADbAgAhgAJAANsCACGKAgEA2gIAIYsCAQDrAgAhjAIBAOsCACEQBAAA9wIAIAUAAP0CACAGAAD-AgAgwAEAAPkCADDBAQAACwAQwgEAAPkCADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHKAQAA_ALcASLLAUAA2wIAIdcBAQDrAgAh2AEBAIcDACHZAQAA-gIAINoBCAD7AgAh3AEBANoCACEMzAGAAAAAAc8BgAAAAAHQAYAAAAAB0QGAAAAAAdIBgAAAAAHTAYAAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AGAAAAAAeEBgAAAAAHiAYAAAAABCMwBCAAAAAHNAQgAAAAEzgEIAAAABM8BCAAAAAHQAQgAAAAB0QEIAAAAAdIBCAAAAAHTAQgArwIAIQTMAQAAANwBAs0BAAAA3AEIzgEAAADcAQjTAQAAuALcASIaAwAA9wIAIAgAAO8CACAOAADzAgAgEQAA8AIAIBIAAPECACDAAQAAjAMAMMEBAAADABDCAQAAjAMAMMMBAQDaAgAhygEAAI8D-AEiywFAANsCACHtAQEA2gIAIe4BAQDaAgAh7wFAANsCACHwAQEA2gIAIfEBAQDaAgAh8gEBANoCACH0AQAAjQP0ASL2AQAAjgP2ASL4ASAAkAMAIfoBAACRA_oBIvsBCAD7AgAh_AEBANoCACH9AUAA2wIAIZsCAAADACCcAgAAAwAgDgQAAPcCACAFAAD9AgAgBwAAiwMAIMABAACJAwAwwQEAAAcAEMIBAACJAwAwwwEBANoCACHEAQEA2gIAIcUBAQDaAgAhygEAAIoD5AEi5AEAAPwC3AEi5QFAANsCACGbAgAABwAgnAIAAAcAIA8EAAD3AgAgBQAA_QIAIA8AAIIDACAQAADwAgAgwAEAAP8CADDBAQAAFwAQwgEAAP8CADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHGAQIAgAMAIccBAQDaAgAhyAEBAOsCACHKAQAAgQPKASLLAUAA2wIAIQjMAQIAAAABzQECAAAABM4BAgAAAATPAQIAAAAB0AECAAAAAdEBAgAAAAHSAQIAAAAB0wECAKcCACEEzAEAAADKAQLNAQAAAMoBCM4BAAAAygEI0wEAAKoCygEiEQQAAPcCACAFAAD9AgAgDwAAggMAIBAAAPACACDAAQAA_wIAMMEBAAAXABDCAQAA_wIAMMMBAQDaAgAhxAEBANoCACHFAQEA2gIAIcYBAgCAAwAhxwEBANoCACHIAQEA6wIAIcoBAACBA8oBIssBQADbAgAhmwIAABcAIJwCAAAXACAMBAAA9wIAIAkAAIQDACDAAQAAgwMAMMEBAAARABDCAQAAgwMAMMMBAQDaAgAhxAEBANoCACHLAUAA2wIAIeYBAQDaAgAh5wEBANoCACHoASAA7AIAIekBAQDrAgAhDwUAAP0CACAKAADyAgAgCwAA9wIAIAwAAPcCACDAAQAAhQMAMMEBAAANABDCAQAAhQMAMMMBAQDaAgAhxQEBANoCACHKAQAAhgPtASLLAUAA2wIAIeoBAQDaAgAh6wEBANoCACGbAgAADQAgnAIAAA0AIA0FAAD9AgAgCgAA8gIAIAsAAPcCACAMAAD3AgAgwAEAAIUDADDBAQAADQAQwgEAAIUDADDDAQEA2gIAIcUBAQDaAgAhygEAAIYD7QEiywFAANsCACHqAQEA2gIAIesBAQDaAgAhBMwBAAAA7QECzQEAAADtAQjOAQAAAO0BCNMBAADHAu0BIgjMAQEAAAABzQEBAAAABc4BAQAAAAXPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAIgDACEIzAEBAAAAAc0BAQAAAAXOAQEAAAAFzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQCIAwAhDAQAAPcCACAFAAD9AgAgBwAAiwMAIMABAACJAwAwwQEAAAcAEMIBAACJAwAwwwEBANoCACHEAQEA2gIAIcUBAQDaAgAhygEAAIoD5AEi5AEAAPwC3AEi5QFAANsCACEEzAEAAADkAQLNAQAAAOQBCM4BAAAA5AEI0wEAAL8C5AEiEgQAAPcCACAFAAD9AgAgBgAA_gIAIMABAAD5AgAwwQEAAAsAEMIBAAD5AgAwwwEBANoCACHEAQEA2gIAIcUBAQDaAgAhygEAAPwC3AEiywFAANsCACHXAQEA6wIAIdgBAQCHAwAh2QEAAPoCACDaAQgA-wIAIdwBAQDaAgAhmwIAAAsAIJwCAAALACAYAwAA9wIAIAgAAO8CACAOAADzAgAgEQAA8AIAIBIAAPECACDAAQAAjAMAMMEBAAADABDCAQAAjAMAMMMBAQDaAgAhygEAAI8D-AEiywFAANsCACHtAQEA2gIAIe4BAQDaAgAh7wFAANsCACHwAQEA2gIAIfEBAQDaAgAh8gEBANoCACH0AQAAjQP0ASL2AQAAjgP2ASL4ASAAkAMAIfoBAACRA_oBIvsBCAD7AgAh_AEBANoCACH9AUAA2wIAIQTMAQAAAPQBAs0BAAAA9AEIzgEAAAD0AQjTAQAA1wL0ASIEzAEAAAD2AQLNAQAAAPYBCM4BAAAA9gEI0wEAANUC9gEiBMwBAAAA-AECzQEAAAD4AQjOAQAAAPgBCNMBAADTAvgBIgLMASAAAAAB0wEgANECACEEzAEAAAD6AQLNAQAAAPoBCM4BAAAA-gEI0wEAAM8C-gEiAAAAAAAAAaACAQAAAAEFoAICAAAAAaYCAgAAAAGnAgIAAAABqAICAAAAAakCAgAAAAEBoAIAAADKAQIBoAJAAAAAAQGgAgEAAAABBSQAAI4GACAlAACYBgAgnQIAAI8GACCeAgAAlwYAIKMCAAABACAFJAAAjAYAICUAAJUGACCdAgAAjQYAIJ4CAACUBgAgowIAAAUAIAckAACKBgAgJQAAkgYAIJ0CAACLBgAgngIAAJEGACChAgAAFwAgogIAABcAIKMCAAAZACALJAAAoQMAMCUAAKYDADCdAgAAogMAMJ4CAACjAwAwnwIAAKQDACCgAgAApQMAMKECAAClAwAwogIAAKUDADCjAgAApQMAMKQCAACnAwAwpQIAAKgDADAKBAAArQMAIAUAAK4DACAQAACvAwAgwwEBAAAAAcQBAQAAAAHFAQEAAAABxgECAAAAAccBAQAAAAHKAQAAAMoBAssBQAAAAAECAAAAGQAgJAAArAMAIAMAAAAZACAkAACsAwAgJQAAqwMAIAEdAACQBgAwDwQAAPcCACAFAAD9AgAgDwAAggMAIBAAAPACACDAAQAA_wIAMMEBAAAXABDCAQAA_wIAMMMBAQAAAAHEAQEA2gIAIcUBAQDaAgAhxgECAIADACHHAQEA2gIAIcgBAQDrAgAhygEAAIEDygEiywFAANsCACECAAAAGQAgHQAAqwMAIAIAAACpAwAgHQAAqgMAIAvAAQAAqAMAMMEBAACpAwAQwgEAAKgDADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHGAQIAgAMAIccBAQDaAgAhyAEBAOsCACHKAQAAgQPKASLLAUAA2wIAIQvAAQAAqAMAMMEBAACpAwAQwgEAAKgDADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHGAQIAgAMAIccBAQDaAgAhyAEBAOsCACHKAQAAgQPKASLLAUAA2wIAIQfDAQEAmAMAIcQBAQCYAwAhxQEBAJgDACHGAQIAmQMAIccBAQCYAwAhygEAAJoDygEiywFAAJsDACEKBAAAnQMAIAUAAJ4DACAQAACgAwAgwwEBAJgDACHEAQEAmAMAIcUBAQCYAwAhxgECAJkDACHHAQEAmAMAIcoBAACaA8oBIssBQACbAwAhCgQAAK0DACAFAACuAwAgEAAArwMAIMMBAQAAAAHEAQEAAAABxQEBAAAAAcYBAgAAAAHHAQEAAAABygEAAADKAQLLAUAAAAABAyQAAI4GACCdAgAAjwYAIKMCAAABACADJAAAjAYAIJ0CAACNBgAgowIAAAUAIAQkAAChAwAwnQIAAKIDADCfAgAApAMAIKMCAAClAwAwAyQAAIoGACCdAgAAiwYAIKMCAAAZACAAAAAAAAWgAggAAAABpgIIAAAAAacCCAAAAAGoAggAAAABqQIIAAAAAQGgAgAAANwBAgUkAAD_BQAgJQAAiAYAIJ0CAACABgAgngIAAIcGACCjAgAAAQAgBSQAAP0FACAlAACFBgAgnQIAAP4FACCeAgAAhAYAIKMCAAAFACAFJAAA-wUAICUAAIIGACCdAgAA_AUAIJ4CAACBBgAgowIAAAkAIAMkAAD_BQAgnQIAAIAGACCjAgAAAQAgAyQAAP0FACCdAgAA_gUAIKMCAAAFACADJAAA-wUAIJ0CAAD8BQAgowIAAAkAIAAAAAGgAgAAAOQBAgUkAADzBQAgJQAA-QUAIJ0CAAD0BQAgngIAAPgFACCjAgAAAQAgBSQAAPEFACAlAAD2BQAgnQIAAPIFACCeAgAA9QUAIKMCAAAFACAHJAAAxQMAICUAAMgDACCdAgAAxgMAIJ4CAADHAwAgoQIAAAsAIKICAAALACCjAgAAHwAgCwQAALsDACAFAAC8AwAgwwEBAAAAAcQBAQAAAAHFAQEAAAABygEAAADcAQLLAUAAAAAB1wEBAAAAAdgBAQAAAAHZAYAAAAAB2gEIAAAAAQIAAAAfACAkAADFAwAgAwAAAAsAICQAAMUDACAlAADJAwAgDQAAAAsAIAQAALgDACAFAAC5AwAgHQAAyQMAIMMBAQCYAwAhxAEBAJgDACHFAQEAmAMAIcoBAAC3A9wBIssBQACbAwAh1wEBAJwDACHYAQEAnAMAIdkBgAAAAAHaAQgAtgMAIQsEAAC4AwAgBQAAuQMAIMMBAQCYAwAhxAEBAJgDACHFAQEAmAMAIcoBAAC3A9wBIssBQACbAwAh1wEBAJwDACHYAQEAnAMAIdkBgAAAAAHaAQgAtgMAIQMkAADzBQAgnQIAAPQFACCjAgAAAQAgAyQAAPEFACCdAgAA8gUAIKMCAAAFACADJAAAxQMAIJ0CAADGAwAgowIAAB8AIAAAAAGgAiAAAAABBSQAAOkFACAlAADvBQAgnQIAAOoFACCeAgAA7gUAIKMCAAABACAHJAAA5wUAICUAAOwFACCdAgAA6AUAIJ4CAADrBQAgoQIAAA0AIKICAAANACCjAgAADwAgAyQAAOkFACCdAgAA6gUAIKMCAAABACADJAAA5wUAIJ0CAADoBQAgowIAAA8AIAAAAAGgAgAAAO0BAgskAADdAwAwJQAA4gMAMJ0CAADeAwAwngIAAN8DADCfAgAA4AMAIKACAADhAwAwoQIAAOEDADCiAgAA4QMAMKMCAADhAwAwpAIAAOMDADClAgAA5AMAMAUkAADbBQAgJQAA5QUAIJ0CAADcBQAgngIAAOQFACCjAgAABQAgBSQAANkFACAlAADiBQAgnQIAANoFACCeAgAA4QUAIKMCAAABACAFJAAA1wUAICUAAN8FACCdAgAA2AUAIJ4CAADeBQAgowIAAAEAIAcEAADTAwAgwwEBAAAAAcQBAQAAAAHLAUAAAAAB5gEBAAAAAecBAQAAAAHoASAAAAABAgAAABMAICQAAOgDACADAAAAEwAgJAAA6AMAICUAAOcDACABHQAA3QUAMAwEAAD3AgAgCQAAhAMAIMABAACDAwAwwQEAABEAEMIBAACDAwAwwwEBAAAAAcQBAQDaAgAhywFAANsCACHmAQEA2gIAIecBAQDaAgAh6AEgAOwCACHpAQEA6wIAIQIAAAATACAdAADnAwAgAgAAAOUDACAdAADmAwAgCsABAADkAwAwwQEAAOUDABDCAQAA5AMAMMMBAQDaAgAhxAEBANoCACHLAUAA2wIAIeYBAQDaAgAh5wEBANoCACHoASAA7AIAIekBAQDrAgAhCsABAADkAwAwwQEAAOUDABDCAQAA5AMAMMMBAQDaAgAhxAEBANoCACHLAUAA2wIAIeYBAQDaAgAh5wEBANoCACHoASAA7AIAIekBAQDrAgAhBsMBAQCYAwAhxAEBAJgDACHLAUAAmwMAIeYBAQCYAwAh5wEBAJgDACHoASAA0AMAIQcEAADRAwAgwwEBAJgDACHEAQEAmAMAIcsBQACbAwAh5gEBAJgDACHnAQEAmAMAIegBIADQAwAhBwQAANMDACDDAQEAAAABxAEBAAAAAcsBQAAAAAHmAQEAAAAB5wEBAAAAAegBIAAAAAEEJAAA3QMAMJ0CAADeAwAwnwIAAOADACCjAgAA4QMAMAMkAADbBQAgnQIAANwFACCjAgAABQAgAyQAANkFACCdAgAA2gUAIKMCAAABACADJAAA1wUAIJ0CAADYBQAgowIAAAEAIAAAAAAAAaACAAAA9AECAaACAAAA9gECAaACAAAA-AECAaACIAAAAAEBoAIAAAD6AQIFJAAAzgUAICUAANUFACCdAgAAzwUAIJ4CAADUBQAgowIAAAEAIAskAACdBAAwJQAAogQAMJ0CAACeBAAwngIAAJ8EADCfAgAAoAQAIKACAAChBAAwoQIAAKEEADCiAgAAoQQAMKMCAAChBAAwpAIAAKMEADClAgAApAQAMAskAACRBAAwJQAAlgQAMJ0CAACSBAAwngIAAJMEADCfAgAAlAQAIKACAACVBAAwoQIAAJUEADCiAgAAlQQAMKMCAACVBAAwpAIAAJcEADClAgAAmAQAMAskAACIBAAwJQAAjAQAMJ0CAACJBAAwngIAAIoEADCfAgAAiwQAIKACAAClAwAwoQIAAKUDADCiAgAApQMAMKMCAAClAwAwpAIAAI0EADClAgAAqAMAMAskAAD8AwAwJQAAgQQAMJ0CAAD9AwAwngIAAP4DADCfAgAA_wMAIKACAACABAAwoQIAAIAEADCiAgAAgAQAMKMCAACABAAwpAIAAIIEADClAgAAgwQAMAsEAAC7AwAgBgAAvQMAIMMBAQAAAAHEAQEAAAABygEAAADcAQLLAUAAAAAB1wEBAAAAAdgBAQAAAAHZAYAAAAAB2gEIAAAAAdwBAQAAAAECAAAAHwAgJAAAhwQAIAMAAAAfACAkAACHBAAgJQAAhgQAIAEdAADTBQAwEAQAAPcCACAFAAD9AgAgBgAA_gIAIMABAAD5AgAwwQEAAAsAEMIBAAD5AgAwwwEBAAAAAcQBAQDaAgAhxQEBANoCACHKAQAA_ALcASLLAUAA2wIAIdcBAQAAAAHYAQEAAAAB2QEAAPoCACDaAQgA-wIAIdwBAQAAAAECAAAAHwAgHQAAhgQAIAIAAACEBAAgHQAAhQQAIA3AAQAAgwQAMMEBAACEBAAQwgEAAIMEADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHKAQAA_ALcASLLAUAA2wIAIdcBAQDrAgAh2AEBAIcDACHZAQAA-gIAINoBCAD7AgAh3AEBANoCACENwAEAAIMEADDBAQAAhAQAEMIBAACDBAAwwwEBANoCACHEAQEA2gIAIcUBAQDaAgAhygEAAPwC3AEiywFAANsCACHXAQEA6wIAIdgBAQCHAwAh2QEAAPoCACDaAQgA-wIAIdwBAQDaAgAhCcMBAQCYAwAhxAEBAJgDACHKAQAAtwPcASLLAUAAmwMAIdcBAQCcAwAh2AEBAJwDACHZAYAAAAAB2gEIALYDACHcAQEAmAMAIQsEAAC4AwAgBgAAugMAIMMBAQCYAwAhxAEBAJgDACHKAQAAtwPcASLLAUAAmwMAIdcBAQCcAwAh2AEBAJwDACHZAYAAAAAB2gEIALYDACHcAQEAmAMAIQsEAAC7AwAgBgAAvQMAIMMBAQAAAAHEAQEAAAABygEAAADcAQLLAUAAAAAB1wEBAAAAAdgBAQAAAAHZAYAAAAAB2gEIAAAAAdwBAQAAAAEKBAAArQMAIA8AALADACAQAACvAwAgwwEBAAAAAcQBAQAAAAHGAQIAAAABxwEBAAAAAcgBAQAAAAHKAQAAAMoBAssBQAAAAAECAAAAGQAgJAAAkAQAIAMAAAAZACAkAACQBAAgJQAAjwQAIAEdAADSBQAwAgAAABkAIB0AAI8EACACAAAAqQMAIB0AAI4EACAHwwEBAJgDACHEAQEAmAMAIcYBAgCZAwAhxwEBAJgDACHIAQEAnAMAIcoBAACaA8oBIssBQACbAwAhCgQAAJ0DACAPAACfAwAgEAAAoAMAIMMBAQCYAwAhxAEBAJgDACHGAQIAmQMAIccBAQCYAwAhyAEBAJwDACHKAQAAmgPKASLLAUAAmwMAIQoEAACtAwAgDwAAsAMAIBAAAK8DACDDAQEAAAABxAEBAAAAAcYBAgAAAAHHAQEAAAAByAEBAAAAAcoBAAAAygECywFAAAAAAQgKAADpAwAgCwAA6wMAIAwAAOwDACDDAQEAAAABygEAAADtAQLLAUAAAAAB6gEBAAAAAesBAQAAAAECAAAADwAgJAAAnAQAIAMAAAAPACAkAACcBAAgJQAAmwQAIAEdAADRBQAwDQUAAP0CACAKAADyAgAgCwAA9wIAIAwAAPcCACDAAQAAhQMAMMEBAAANABDCAQAAhQMAMMMBAQAAAAHFAQEA2gIAIcoBAACGA-0BIssBQADbAgAh6gEBANoCACHrAQEA2gIAIQIAAAAPACAdAACbBAAgAgAAAJkEACAdAACaBAAgCcABAACYBAAwwQEAAJkEABDCAQAAmAQAMMMBAQDaAgAhxQEBANoCACHKAQAAhgPtASLLAUAA2wIAIeoBAQDaAgAh6wEBANoCACEJwAEAAJgEADDBAQAAmQQAEMIBAACYBAAwwwEBANoCACHFAQEA2gIAIcoBAACGA-0BIssBQADbAgAh6gEBANoCACHrAQEA2gIAIQXDAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACHrAQEAmAMAIQgKAADZAwAgCwAA2wMAIAwAANwDACDDAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACHrAQEAmAMAIQgKAADpAwAgCwAA6wMAIAwAAOwDACDDAQEAAAABygEAAADtAQLLAUAAAAAB6gEBAAAAAesBAQAAAAEHBAAAygMAIAcAAMwDACDDAQEAAAABxAEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABAgAAAAkAICQAAKgEACADAAAACQAgJAAAqAQAICUAAKcEACABHQAA0AUAMAwEAAD3AgAgBQAA_QIAIAcAAIsDACDAAQAAiQMAMMEBAAAHABDCAQAAiQMAMMMBAQAAAAHEAQEA2gIAIcUBAQDaAgAhygEAAIoD5AEi5AEAAPwC3AEi5QFAANsCACECAAAACQAgHQAApwQAIAIAAAClBAAgHQAApgQAIAnAAQAApAQAMMEBAAClBAAQwgEAAKQEADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHKAQAAigPkASLkAQAA_ALcASLlAUAA2wIAIQnAAQAApAQAMMEBAAClBAAQwgEAAKQEADDDAQEA2gIAIcQBAQDaAgAhxQEBANoCACHKAQAAigPkASLkAQAA_ALcASLlAUAA2wIAIQXDAQEAmAMAIcQBAQCYAwAhygEAAMED5AEi5AEAALcD3AEi5QFAAJsDACEHBAAAwgMAIAcAAMQDACDDAQEAmAMAIcQBAQCYAwAhygEAAMED5AEi5AEAALcD3AEi5QFAAJsDACEHBAAAygMAIAcAAMwDACDDAQEAAAABxAEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABAyQAAM4FACCdAgAAzwUAIKMCAAABACAEJAAAnQQAMJ0CAACeBAAwnwIAAKAEACCjAgAAoQQAMAQkAACRBAAwnQIAAJIEADCfAgAAlAQAIKMCAACVBAAwBCQAAIgEADCdAgAAiQQAMJ8CAACLBAAgowIAAKUDADAEJAAA_AMAMJ0CAAD9AwAwnwIAAP8DACCjAgAAgAQAMAAAAAAAAAGgAkAAAAABBSQAAMkFACAlAADMBQAgnQIAAMoFACCeAgAAywUAIKMCAAABACADJAAAyQUAIJ0CAADKBQAgowIAAAEAIAAAAAUkAADEBQAgJQAAxwUAIJ0CAADFBQAgngIAAMYFACCjAgAAAQAgAyQAAMQFACCdAgAAxQUAIKMCAAABACAAAAABoAIAAACQAgIBoAIAAACSAgILJAAAmAUAMCUAAJ0FADCdAgAAmQUAMJ4CAACaBQAwnwIAAJsFACCgAgAAnAUAMKECAACcBQAwogIAAJwFADCjAgAAnAUAMKQCAACeBQAwpQIAAJ8FADALJAAAjwUAMCUAAJMFADCdAgAAkAUAMJ4CAACRBQAwnwIAAJIFACCgAgAAoQQAMKECAAChBAAwogIAAKEEADCjAgAAoQQAMKQCAACUBQAwpQIAAKQEADALJAAAhgUAMCUAAIoFADCdAgAAhwUAMJ4CAACIBQAwnwIAAIkFACCgAgAApQMAMKECAAClAwAwogIAAKUDADCjAgAApQMAMKQCAACLBQAwpQIAAKgDADALJAAA_QQAMCUAAIEFADCdAgAA_gQAMJ4CAAD_BAAwnwIAAIAFACCgAgAAgAQAMKECAACABAAwogIAAIAEADCjAgAAgAQAMKQCAACCBQAwpQIAAIMEADALJAAA9AQAMCUAAPgEADCdAgAA9QQAMJ4CAAD2BAAwnwIAAPcEACCgAgAA4QMAMKECAADhAwAwogIAAOEDADCjAgAA4QMAMKQCAAD5BAAwpQIAAOQDADALJAAA6wQAMCUAAO8EADCdAgAA7AQAMJ4CAADtBAAwnwIAAO4EACCgAgAAlQQAMKECAACVBAAwogIAAJUEADCjAgAAlQQAMKQCAADwBAAwpQIAAJgEADALJAAA4gQAMCUAAOYEADCdAgAA4wQAMJ4CAADkBAAwnwIAAOUEACCgAgAAlQQAMKECAACVBAAwogIAAJUEADCjAgAAlQQAMKQCAADnBAAwpQIAAJgEADALJAAA1gQAMCUAANsEADCdAgAA1wQAMJ4CAADYBAAwnwIAANkEACCgAgAA2gQAMKECAADaBAAwogIAANoEADCjAgAA2gQAMKQCAADcBAAwpQIAAN0EADALJAAAygQAMCUAAM8EADCdAgAAywQAMJ4CAADMBAAwnwIAAM0EACCgAgAAzgQAMKECAADOBAAwogIAAM4EADCjAgAAzgQAMKQCAADQBAAwpQIAANEEADAMwwEBAAAAAcsBQAAAAAH9AUAAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGJAgEAAAABAgAAADEAICQAANUEACADAAAAMQAgJAAA1QQAICUAANQEACABHQAAwwUAMBEEAAD3AgAgwAEAAPYCADDBAQAALwAQwgEAAPYCADDDAQEAAAABxAEBANoCACHLAUAA2wIAIf0BQADbAgAhgQIBANoCACGCAgEA2gIAIYMCAQDrAgAhhAIBAOsCACGFAgEA6wIAIYYCQADtAgAhhwJAAO0CACGIAgEA6wIAIYkCAQDrAgAhAgAAADEAIB0AANQEACACAAAA0gQAIB0AANMEACAQwAEAANEEADDBAQAA0gQAEMIBAADRBAAwwwEBANoCACHEAQEA2gIAIcsBQADbAgAh_QFAANsCACGBAgEA2gIAIYICAQDaAgAhgwIBAOsCACGEAgEA6wIAIYUCAQDrAgAhhgJAAO0CACGHAkAA7QIAIYgCAQDrAgAhiQIBAOsCACEQwAEAANEEADDBAQAA0gQAEMIBAADRBAAwwwEBANoCACHEAQEA2gIAIcsBQADbAgAh_QFAANsCACGBAgEA2gIAIYICAQDaAgAhgwIBAOsCACGEAgEA6wIAIYUCAQDrAgAhhgJAAO0CACGHAkAA7QIAIYgCAQDrAgAhiQIBAOsCACEMwwEBAJgDACHLAUAAmwMAIf0BQACbAwAhgQIBAJgDACGCAgEAmAMAIYMCAQCcAwAhhAIBAJwDACGFAgEAnAMAIYYCQAC0BAAhhwJAALQEACGIAgEAnAMAIYkCAQCcAwAhDMMBAQCYAwAhywFAAJsDACH9AUAAmwMAIYECAQCYAwAhggIBAJgDACGDAgEAnAMAIYQCAQCcAwAhhQIBAJwDACGGAkAAtAQAIYcCQAC0BAAhiAIBAJwDACGJAgEAnAMAIQzDAQEAAAABywFAAAAAAf0BQAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAYkCAQAAAAEHwwEBAAAAAcsBQAAAAAH9AUAAAAABgAJAAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAQIAAAAtACAkAADhBAAgAwAAAC0AICQAAOEEACAlAADgBAAgAR0AAMIFADAMBAAA9wIAIMABAAD4AgAwwQEAACsAEMIBAAD4AgAwwwEBAAAAAcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYACQADbAgAhigIBAAAAAYsCAQDrAgAhjAIBAOsCACECAAAALQAgHQAA4AQAIAIAAADeBAAgHQAA3wQAIAvAAQAA3QQAMMEBAADeBAAQwgEAAN0EADDDAQEA2gIAIcQBAQDaAgAhywFAANsCACH9AUAA2wIAIYACQADbAgAhigIBANoCACGLAgEA6wIAIYwCAQDrAgAhC8ABAADdBAAwwQEAAN4EABDCAQAA3QQAMMMBAQDaAgAhxAEBANoCACHLAUAA2wIAIf0BQADbAgAhgAJAANsCACGKAgEA2gIAIYsCAQDrAgAhjAIBAOsCACEHwwEBAJgDACHLAUAAmwMAIf0BQACbAwAhgAJAAJsDACGKAgEAmAMAIYsCAQCcAwAhjAIBAJwDACEHwwEBAJgDACHLAUAAmwMAIf0BQACbAwAhgAJAAJsDACGKAgEAmAMAIYsCAQCcAwAhjAIBAJwDACEHwwEBAAAAAcsBQAAAAAH9AUAAAAABgAJAAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAQgFAADqAwAgCgAA6QMAIAsAAOsDACDDAQEAAAABxQEBAAAAAcoBAAAA7QECywFAAAAAAeoBAQAAAAECAAAADwAgJAAA6gQAIAMAAAAPACAkAADqBAAgJQAA6QQAIAEdAADBBQAwAgAAAA8AIB0AAOkEACACAAAAmQQAIB0AAOgEACAFwwEBAJgDACHFAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACEIBQAA2gMAIAoAANkDACALAADbAwAgwwEBAJgDACHFAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACEIBQAA6gMAIAoAAOkDACALAADrAwAgwwEBAAAAAcUBAQAAAAHKAQAAAO0BAssBQAAAAAHqAQEAAAABCAUAAOoDACAKAADpAwAgDAAA7AMAIMMBAQAAAAHFAQEAAAABygEAAADtAQLLAUAAAAAB6wEBAAAAAQIAAAAPACAkAADzBAAgAwAAAA8AICQAAPMEACAlAADyBAAgAR0AAMAFADACAAAADwAgHQAA8gQAIAIAAACZBAAgHQAA8QQAIAXDAQEAmAMAIcUBAQCYAwAhygEAANgD7QEiywFAAJsDACHrAQEAmAMAIQgFAADaAwAgCgAA2QMAIAwAANwDACDDAQEAmAMAIcUBAQCYAwAhygEAANgD7QEiywFAAJsDACHrAQEAmAMAIQgFAADqAwAgCgAA6QMAIAwAAOwDACDDAQEAAAABxQEBAAAAAcoBAAAA7QECywFAAAAAAesBAQAAAAEHCQAA1AMAIMMBAQAAAAHLAUAAAAAB5gEBAAAAAecBAQAAAAHoASAAAAAB6QEBAAAAAQIAAAATACAkAAD8BAAgAwAAABMAICQAAPwEACAlAAD7BAAgAR0AAL8FADACAAAAEwAgHQAA-wQAIAIAAADlAwAgHQAA-gQAIAbDAQEAmAMAIcsBQACbAwAh5gEBAJgDACHnAQEAmAMAIegBIADQAwAh6QEBAJwDACEHCQAA0gMAIMMBAQCYAwAhywFAAJsDACHmAQEAmAMAIecBAQCYAwAh6AEgANADACHpAQEAnAMAIQcJAADUAwAgwwEBAAAAAcsBQAAAAAHmAQEAAAAB5wEBAAAAAegBIAAAAAHpAQEAAAABCwUAALwDACAGAAC9AwAgwwEBAAAAAcUBAQAAAAHKAQAAANwBAssBQAAAAAHXAQEAAAAB2AEBAAAAAdkBgAAAAAHaAQgAAAAB3AEBAAAAAQIAAAAfACAkAACFBQAgAwAAAB8AICQAAIUFACAlAACEBQAgAR0AAL4FADACAAAAHwAgHQAAhAUAIAIAAACEBAAgHQAAgwUAIAnDAQEAmAMAIcUBAQCYAwAhygEAALcD3AEiywFAAJsDACHXAQEAnAMAIdgBAQCcAwAh2QGAAAAAAdoBCAC2AwAh3AEBAJgDACELBQAAuQMAIAYAALoDACDDAQEAmAMAIcUBAQCYAwAhygEAALcD3AEiywFAAJsDACHXAQEAnAMAIdgBAQCcAwAh2QGAAAAAAdoBCAC2AwAh3AEBAJgDACELBQAAvAMAIAYAAL0DACDDAQEAAAABxQEBAAAAAcoBAAAA3AECywFAAAAAAdcBAQAAAAHYAQEAAAAB2QGAAAAAAdoBCAAAAAHcAQEAAAABCgUAAK4DACAPAACwAwAgEAAArwMAIMMBAQAAAAHFAQEAAAABxgECAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABAgAAABkAICQAAI4FACADAAAAGQAgJAAAjgUAICUAAI0FACABHQAAvQUAMAIAAAAZACAdAACNBQAgAgAAAKkDACAdAACMBQAgB8MBAQCYAwAhxQEBAJgDACHGAQIAmQMAIccBAQCYAwAhyAEBAJwDACHKAQAAmgPKASLLAUAAmwMAIQoFAACeAwAgDwAAnwMAIBAAAKADACDDAQEAmAMAIcUBAQCYAwAhxgECAJkDACHHAQEAmAMAIcgBAQCcAwAhygEAAJoDygEiywFAAJsDACEKBQAArgMAIA8AALADACAQAACvAwAgwwEBAAAAAcUBAQAAAAHGAQIAAAABxwEBAAAAAcgBAQAAAAHKAQAAAMoBAssBQAAAAAEHBQAAywMAIAcAAMwDACDDAQEAAAABxQEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABAgAAAAkAICQAAJcFACADAAAACQAgJAAAlwUAICUAAJYFACABHQAAvAUAMAIAAAAJACAdAACWBQAgAgAAAKUEACAdAACVBQAgBcMBAQCYAwAhxQEBAJgDACHKAQAAwQPkASLkAQAAtwPcASLlAUAAmwMAIQcFAADDAwAgBwAAxAMAIMMBAQCYAwAhxQEBAJgDACHKAQAAwQPkASLkAQAAtwPcASLlAUAAmwMAIQcFAADLAwAgBwAAzAMAIMMBAQAAAAHFAQEAAAABygEAAADkAQLkAQAAANwBAuUBQAAAAAETCAAAqgQAIA4AAKsEACARAACsBAAgEgAArQQAIMMBAQAAAAHKAQAAAPgBAssBQAAAAAHtAQEAAAAB7gEBAAAAAe8BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAH0AQAAAPQBAvYBAAAA9gEC-AEgAAAAAfoBAAAA-gEC-wEIAAAAAf0BQAAAAAECAAAABQAgJAAAowUAIAMAAAAFACAkAACjBQAgJQAAogUAIAEdAAC7BQAwGAMAAPcCACAIAADvAgAgDgAA8wIAIBEAAPACACASAADxAgAgwAEAAIwDADDBAQAAAwAQwgEAAIwDADDDAQEAAAABygEAAI8D-AEiywFAANsCACHtAQEA2gIAIe4BAQDaAgAh7wFAANsCACHwAQEA2gIAIfEBAQDaAgAh8gEBANoCACH0AQAAjQP0ASL2AQAAjgP2ASL4ASAAkAMAIfoBAACRA_oBIvsBCAD7AgAh_AEBANoCACH9AUAA2wIAIQIAAAAFACAdAACiBQAgAgAAAKAFACAdAAChBQAgE8ABAACfBQAwwQEAAKAFABDCAQAAnwUAMMMBAQDaAgAhygEAAI8D-AEiywFAANsCACHtAQEA2gIAIe4BAQDaAgAh7wFAANsCACHwAQEA2gIAIfEBAQDaAgAh8gEBANoCACH0AQAAjQP0ASL2AQAAjgP2ASL4ASAAkAMAIfoBAACRA_oBIvsBCAD7AgAh_AEBANoCACH9AUAA2wIAIRPAAQAAnwUAMMEBAACgBQAQwgEAAJ8FADDDAQEA2gIAIcoBAACPA_gBIssBQADbAgAh7QEBANoCACHuAQEA2gIAIe8BQADbAgAh8AEBANoCACHxAQEA2gIAIfIBAQDaAgAh9AEAAI0D9AEi9gEAAI4D9gEi-AEgAJADACH6AQAAkQP6ASL7AQgA-wIAIfwBAQDaAgAh_QFAANsCACEPwwEBAJgDACHKAQAA9AP4ASLLAUAAmwMAIe0BAQCYAwAh7gEBAJgDACHvAUAAmwMAIfABAQCYAwAh8QEBAJgDACHyAQEAmAMAIfQBAADyA_QBIvYBAADzA_YBIvgBIAD1AwAh-gEAAPYD-gEi-wEIALYDACH9AUAAmwMAIRMIAAD4AwAgDgAA-QMAIBEAAPoDACASAAD7AwAgwwEBAJgDACHKAQAA9AP4ASLLAUAAmwMAIe0BAQCYAwAh7gEBAJgDACHvAUAAmwMAIfABAQCYAwAh8QEBAJgDACHyAQEAmAMAIfQBAADyA_QBIvYBAADzA_YBIvgBIAD1AwAh-gEAAPYD-gEi-wEIALYDACH9AUAAmwMAIRMIAACqBAAgDgAAqwQAIBEAAKwEACASAACtBAAgwwEBAAAAAcoBAAAA-AECywFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAAAA9AEC9gEAAAD2AQL4ASAAAAAB-gEAAAD6AQL7AQgAAAAB_QFAAAAAAQQkAACYBQAwnQIAAJkFADCfAgAAmwUAIKMCAACcBQAwBCQAAI8FADCdAgAAkAUAMJ8CAACSBQAgowIAAKEEADAEJAAAhgUAMJ0CAACHBQAwnwIAAIkFACCjAgAApQMAMAQkAAD9BAAwnQIAAP4EADCfAgAAgAUAIKMCAACABAAwBCQAAPQEADCdAgAA9QQAMJ8CAAD3BAAgowIAAOEDADAEJAAA6wQAMJ0CAADsBAAwnwIAAO4EACCjAgAAlQQAMAQkAADiBAAwnQIAAOMEADCfAgAA5QQAIKMCAACVBAAwBCQAANYEADCdAgAA1wQAMJ8CAADZBAAgowIAANoEADAEJAAAygQAMJ0CAADLBAAwnwIAAM0EACCjAgAAzgQAMAAAAAAAAAAADAgAAK4FACAKAACxBQAgEQAArwUAIBIAALAFACATAACtBQAgFAAAsgUAIBUAALIFACAWAACzBQAgFwAAtAUAIJICAACSAwAglAIAAJIDACCVAgAAkgMAIAYDAAC1BQAgCAAArgUAIA4AALIFACARAACvBQAgEgAAsAUAIPgBAACSAwAgAwQAALUFACAFAAC2BQAgBwAAugUAIAUEAAC1BQAgBQAAtgUAIA8AALgFACAQAACvBQAgyAEAAJIDACAEBQAAtgUAIAoAALEFACALAAC1BQAgDAAAtQUAIAYEAAC1BQAgBQAAtgUAIAYAALcFACDXAQAAkgMAINgBAACSAwAg2QEAAJIDACAPwwEBAAAAAcoBAAAA-AECywFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAAAA9AEC9gEAAAD2AQL4ASAAAAAB-gEAAAD6AQL7AQgAAAAB_QFAAAAAAQXDAQEAAAABxQEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABB8MBAQAAAAHFAQEAAAABxgECAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABCcMBAQAAAAHFAQEAAAABygEAAADcAQLLAUAAAAAB1wEBAAAAAdgBAQAAAAHZAYAAAAAB2gEIAAAAAdwBAQAAAAEGwwEBAAAAAcsBQAAAAAHmAQEAAAAB5wEBAAAAAegBIAAAAAHpAQEAAAABBcMBAQAAAAHFAQEAAAABygEAAADtAQLLAUAAAAAB6wEBAAAAAQXDAQEAAAABxQEBAAAAAcoBAAAA7QECywFAAAAAAeoBAQAAAAEHwwEBAAAAAcsBQAAAAAH9AUAAAAABgAJAAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAQzDAQEAAAABywFAAAAAAf0BQAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAYkCAQAAAAEWCAAApQUAIAoAAKgFACARAACmBQAgEgAApwUAIBMAAKQFACAUAACpBQAgFQAAqgUAIBcAAKwFACDDAQEAAAABygEAAACSAgLLAUAAAAAB8gEBAAAAAf0BQAAAAAGNAgEAAAABjgIBAAAAAZACAAAAkAICkgIBAAAAAZMCIAAAAAGUAkAAAAABlQIBAAAAAZYCIAAAAAGXAiAAAAABAgAAAAEAICQAAMQFACADAAAAPQAgJAAAxAUAICUAAMgFACAYAAAAPQAgCAAAwgQAIAoAAMUEACARAADDBAAgEgAAxAQAIBMAAMEEACAUAADGBAAgFQAAxwQAIBcAAMkEACAdAADIBQAgwwEBAJgDACHKAQAAwASSAiLLAUAAmwMAIfIBAQCYAwAh_QFAAJsDACGNAgEAmAMAIY4CAQCYAwAhkAIAAL8EkAIikgIBAJwDACGTAiAA0AMAIZQCQAC0BAAhlQIBAJwDACGWAiAA0AMAIZcCIADQAwAhFggAAMIEACAKAADFBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFAAAxgQAIBUAAMcEACAXAADJBAAgwwEBAJgDACHKAQAAwASSAiLLAUAAmwMAIfIBAQCYAwAh_QFAAJsDACGNAgEAmAMAIY4CAQCYAwAhkAIAAL8EkAIikgIBAJwDACGTAiAA0AMAIZQCQAC0BAAhlQIBAJwDACGWAiAA0AMAIZcCIADQAwAhFggAAKUFACAKAACoBQAgEQAApgUAIBIAAKcFACATAACkBQAgFAAAqQUAIBUAAKoFACAWAACrBQAgwwEBAAAAAcoBAAAAkgICywFAAAAAAfIBAQAAAAH9AUAAAAABjQIBAAAAAY4CAQAAAAGQAgAAAJACApICAQAAAAGTAiAAAAABlAJAAAAAAZUCAQAAAAGWAiAAAAABlwIgAAAAAQIAAAABACAkAADJBQAgAwAAAD0AICQAAMkFACAlAADNBQAgGAAAAD0AIAgAAMIEACAKAADFBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgHQAAzQUAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAADCBAAgCgAAxQQAIBEAAMMEACASAADEBAAgEwAAwQQAIBQAAMYEACAVAADHBAAgFgAAyAQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAAClBQAgCgAAqAUAIBEAAKYFACASAACnBQAgFAAAqQUAIBUAAKoFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAAzgUAIAXDAQEAAAABxAEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABBcMBAQAAAAHKAQAAAO0BAssBQAAAAAHqAQEAAAAB6wEBAAAAAQfDAQEAAAABxAEBAAAAAcYBAgAAAAHHAQEAAAAByAEBAAAAAcoBAAAAygECywFAAAAAAQnDAQEAAAABxAEBAAAAAcoBAAAA3AECywFAAAAAAdcBAQAAAAHYAQEAAAAB2QGAAAAAAdoBCAAAAAHcAQEAAAABAwAAAD0AICQAAM4FACAlAADWBQAgGAAAAD0AIAgAAMIEACAKAADFBAAgEQAAwwQAIBIAAMQEACAUAADGBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgHQAA1gUAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAADCBAAgCgAAxQQAIBEAAMMEACASAADEBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgFwAAyQQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAAClBQAgCgAAqAUAIBEAAKYFACASAACnBQAgEwAApAUAIBQAAKkFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAA1wUAIBYIAAClBQAgCgAAqAUAIBEAAKYFACASAACnBQAgEwAApAUAIBUAAKoFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAA2QUAIBQDAACpBAAgCAAAqgQAIBEAAKwEACASAACtBAAgwwEBAAAAAcoBAAAA-AECywFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAAAA9AEC9gEAAAD2AQL4ASAAAAAB-gEAAAD6AQL7AQgAAAAB_AEBAAAAAf0BQAAAAAECAAAABQAgJAAA2wUAIAbDAQEAAAABxAEBAAAAAcsBQAAAAAHmAQEAAAAB5wEBAAAAAegBIAAAAAEDAAAAPQAgJAAA1wUAICUAAOAFACAYAAAAPQAgCAAAwgQAIAoAAMUEACARAADDBAAgEgAAxAQAIBMAAMEEACAUAADGBAAgFgAAyAQAIBcAAMkEACAdAADgBQAgwwEBAJgDACHKAQAAwASSAiLLAUAAmwMAIfIBAQCYAwAh_QFAAJsDACGNAgEAmAMAIY4CAQCYAwAhkAIAAL8EkAIikgIBAJwDACGTAiAA0AMAIZQCQAC0BAAhlQIBAJwDACGWAiAA0AMAIZcCIADQAwAhFggAAMIEACAKAADFBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFAAAxgQAIBYAAMgEACAXAADJBAAgwwEBAJgDACHKAQAAwASSAiLLAUAAmwMAIfIBAQCYAwAh_QFAAJsDACGNAgEAmAMAIY4CAQCYAwAhkAIAAL8EkAIikgIBAJwDACGTAiAA0AMAIZQCQAC0BAAhlQIBAJwDACGWAiAA0AMAIZcCIADQAwAhAwAAAD0AICQAANkFACAlAADjBQAgGAAAAD0AIAgAAMIEACAKAADFBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgHQAA4wUAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAADCBAAgCgAAxQQAIBEAAMMEACASAADEBAAgEwAAwQQAIBUAAMcEACAWAADIBAAgFwAAyQQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIQMAAAADACAkAADbBQAgJQAA5gUAIBYAAAADACADAAD3AwAgCAAA-AMAIBEAAPoDACASAAD7AwAgHQAA5gUAIMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIRQDAAD3AwAgCAAA-AMAIBEAAPoDACASAAD7AwAgwwEBAJgDACHKAQAA9AP4ASLLAUAAmwMAIe0BAQCYAwAh7gEBAJgDACHvAUAAmwMAIfABAQCYAwAh8QEBAJgDACHyAQEAmAMAIfQBAADyA_QBIvYBAADzA_YBIvgBIAD1AwAh-gEAAPYD-gEi-wEIALYDACH8AQEAmAMAIf0BQACbAwAhCQUAAOoDACALAADrAwAgDAAA7AMAIMMBAQAAAAHFAQEAAAABygEAAADtAQLLAUAAAAAB6gEBAAAAAesBAQAAAAECAAAADwAgJAAA5wUAIBYIAAClBQAgEQAApgUAIBIAAKcFACATAACkBQAgFAAAqQUAIBUAAKoFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAA6QUAIAMAAAANACAkAADnBQAgJQAA7QUAIAsAAAANACAFAADaAwAgCwAA2wMAIAwAANwDACAdAADtBQAgwwEBAJgDACHFAQEAmAMAIcoBAADYA-0BIssBQACbAwAh6gEBAJgDACHrAQEAmAMAIQkFAADaAwAgCwAA2wMAIAwAANwDACDDAQEAmAMAIcUBAQCYAwAhygEAANgD7QEiywFAAJsDACHqAQEAmAMAIesBAQCYAwAhAwAAAD0AICQAAOkFACAlAADwBQAgGAAAAD0AIAgAAMIEACARAADDBAAgEgAAxAQAIBMAAMEEACAUAADGBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgHQAA8AUAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAADCBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgFwAAyQQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRQDAACpBAAgDgAAqwQAIBEAAKwEACASAACtBAAgwwEBAAAAAcoBAAAA-AECywFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAAAA9AEC9gEAAAD2AQL4ASAAAAAB-gEAAAD6AQL7AQgAAAAB_AEBAAAAAf0BQAAAAAECAAAABQAgJAAA8QUAIBYKAACoBQAgEQAApgUAIBIAAKcFACATAACkBQAgFAAAqQUAIBUAAKoFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAA8wUAIAMAAAADACAkAADxBQAgJQAA9wUAIBYAAAADACADAAD3AwAgDgAA-QMAIBEAAPoDACASAAD7AwAgHQAA9wUAIMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIRQDAAD3AwAgDgAA-QMAIBEAAPoDACASAAD7AwAgwwEBAJgDACHKAQAA9AP4ASLLAUAAmwMAIe0BAQCYAwAh7gEBAJgDACHvAUAAmwMAIfABAQCYAwAh8QEBAJgDACHyAQEAmAMAIfQBAADyA_QBIvYBAADzA_YBIvgBIAD1AwAh-gEAAPYD-gEi-wEIALYDACH8AQEAmAMAIf0BQACbAwAhAwAAAD0AICQAAPMFACAlAAD6BQAgGAAAAD0AIAoAAMUEACARAADDBAAgEgAAxAQAIBMAAMEEACAUAADGBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgHQAA-gUAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYKAADFBAAgEQAAwwQAIBIAAMQEACATAADBBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgFwAAyQQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIQgEAADKAwAgBQAAywMAIMMBAQAAAAHEAQEAAAABxQEBAAAAAcoBAAAA5AEC5AEAAADcAQLlAUAAAAABAgAAAAkAICQAAPsFACAUAwAAqQQAIAgAAKoEACAOAACrBAAgEQAArAQAIMMBAQAAAAHKAQAAAPgBAssBQAAAAAHtAQEAAAAB7gEBAAAAAe8BQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAH0AQAAAPQBAvYBAAAA9gEC-AEgAAAAAfoBAAAA-gEC-wEIAAAAAfwBAQAAAAH9AUAAAAABAgAAAAUAICQAAP0FACAWCAAApQUAIAoAAKgFACARAACmBQAgEwAApAUAIBQAAKkFACAVAACqBQAgFgAAqwUAIBcAAKwFACDDAQEAAAABygEAAACSAgLLAUAAAAAB8gEBAAAAAf0BQAAAAAGNAgEAAAABjgIBAAAAAZACAAAAkAICkgIBAAAAAZMCIAAAAAGUAkAAAAABlQIBAAAAAZYCIAAAAAGXAiAAAAABAgAAAAEAICQAAP8FACADAAAABwAgJAAA-wUAICUAAIMGACAKAAAABwAgBAAAwgMAIAUAAMMDACAdAACDBgAgwwEBAJgDACHEAQEAmAMAIcUBAQCYAwAhygEAAMED5AEi5AEAALcD3AEi5QFAAJsDACEIBAAAwgMAIAUAAMMDACDDAQEAmAMAIcQBAQCYAwAhxQEBAJgDACHKAQAAwQPkASLkAQAAtwPcASLlAUAAmwMAIQMAAAADACAkAAD9BQAgJQAAhgYAIBYAAAADACADAAD3AwAgCAAA-AMAIA4AAPkDACARAAD6AwAgHQAAhgYAIMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIRQDAAD3AwAgCAAA-AMAIA4AAPkDACARAAD6AwAgwwEBAJgDACHKAQAA9AP4ASLLAUAAmwMAIe0BAQCYAwAh7gEBAJgDACHvAUAAmwMAIfABAQCYAwAh8QEBAJgDACHyAQEAmAMAIfQBAADyA_QBIvYBAADzA_YBIvgBIAD1AwAh-gEAAPYD-gEi-wEIALYDACH8AQEAmAMAIf0BQACbAwAhAwAAAD0AICQAAP8FACAlAACJBgAgGAAAAD0AIAgAAMIEACAKAADFBAAgEQAAwwQAIBMAAMEEACAUAADGBAAgFQAAxwQAIBYAAMgEACAXAADJBAAgHQAAiQYAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIRYIAADCBAAgCgAAxQQAIBEAAMMEACATAADBBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgFwAAyQQAIMMBAQCYAwAhygEAAMAEkgIiywFAAJsDACHyAQEAmAMAIf0BQACbAwAhjQIBAJgDACGOAgEAmAMAIZACAAC_BJACIpICAQCcAwAhkwIgANADACGUAkAAtAQAIZUCAQCcAwAhlgIgANADACGXAiAA0AMAIQsEAACtAwAgBQAArgMAIA8AALADACDDAQEAAAABxAEBAAAAAcUBAQAAAAHGAQIAAAABxwEBAAAAAcgBAQAAAAHKAQAAAMoBAssBQAAAAAECAAAAGQAgJAAAigYAIBQDAACpBAAgCAAAqgQAIA4AAKsEACASAACtBAAgwwEBAAAAAcoBAAAA-AECywFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfQBAAAA9AEC9gEAAAD2AQL4ASAAAAAB-gEAAAD6AQL7AQgAAAAB_AEBAAAAAf0BQAAAAAECAAAABQAgJAAAjAYAIBYIAAClBQAgCgAAqAUAIBIAAKcFACATAACkBQAgFAAAqQUAIBUAAKoFACAWAACrBQAgFwAArAUAIMMBAQAAAAHKAQAAAJICAssBQAAAAAHyAQEAAAAB_QFAAAAAAY0CAQAAAAGOAgEAAAABkAIAAACQAgKSAgEAAAABkwIgAAAAAZQCQAAAAAGVAgEAAAABlgIgAAAAAZcCIAAAAAECAAAAAQAgJAAAjgYAIAfDAQEAAAABxAEBAAAAAcUBAQAAAAHGAQIAAAABxwEBAAAAAcoBAAAAygECywFAAAAAAQMAAAAXACAkAACKBgAgJQAAkwYAIA0AAAAXACAEAACdAwAgBQAAngMAIA8AAJ8DACAdAACTBgAgwwEBAJgDACHEAQEAmAMAIcUBAQCYAwAhxgECAJkDACHHAQEAmAMAIcgBAQCcAwAhygEAAJoDygEiywFAAJsDACELBAAAnQMAIAUAAJ4DACAPAACfAwAgwwEBAJgDACHEAQEAmAMAIcUBAQCYAwAhxgECAJkDACHHAQEAmAMAIcgBAQCcAwAhygEAAJoDygEiywFAAJsDACEDAAAAAwAgJAAAjAYAICUAAJYGACAWAAAAAwAgAwAA9wMAIAgAAPgDACAOAAD5AwAgEgAA-wMAIB0AAJYGACDDAQEAmAMAIcoBAAD0A_gBIssBQACbAwAh7QEBAJgDACHuAQEAmAMAIe8BQACbAwAh8AEBAJgDACHxAQEAmAMAIfIBAQCYAwAh9AEAAPID9AEi9gEAAPMD9gEi-AEgAPUDACH6AQAA9gP6ASL7AQgAtgMAIfwBAQCYAwAh_QFAAJsDACEUAwAA9wMAIAgAAPgDACAOAAD5AwAgEgAA-wMAIMMBAQCYAwAhygEAAPQD-AEiywFAAJsDACHtAQEAmAMAIe4BAQCYAwAh7wFAAJsDACHwAQEAmAMAIfEBAQCYAwAh8gEBAJgDACH0AQAA8gP0ASL2AQAA8wP2ASL4ASAA9QMAIfoBAAD2A_oBIvsBCAC2AwAh_AEBAJgDACH9AUAAmwMAIQMAAAA9ACAkAACOBgAgJQAAmQYAIBgAAAA9ACAIAADCBAAgCgAAxQQAIBIAAMQEACATAADBBAAgFAAAxgQAIBUAAMcEACAWAADIBAAgFwAAyQQAIB0AAJkGACDDAQEAmAMAIcoBAADABJICIssBQACbAwAh8gEBAJgDACH9AUAAmwMAIY0CAQCYAwAhjgIBAJgDACGQAgAAvwSQAiKSAgEAnAMAIZMCIADQAwAhlAJAALQEACGVAgEAnAMAIZYCIADQAwAhlwIgANADACEWCAAAwgQAIAoAAMUEACASAADEBAAgEwAAwQQAIBQAAMYEACAVAADHBAAgFgAAyAQAIBcAAMkEACDDAQEAmAMAIcoBAADABJICIssBQACbAwAh8gEBAJgDACH9AUAAmwMAIY0CAQCYAwAhjgIBAJgDACGQAgAAvwSQAiKSAgEAnAMAIZMCIADQAwAhlAJAALQEACGVAgEAnAMAIZYCIADQAwAhlwIgANADACEKCCUDCigGDQANESYIEicEEwYCFCkFFSoFFi4LFzIMBgMAAQgKAw0ACg4QBREaCBIgBAMEAAEFAAIHDAQDBAABBQACBgADBQUAAgoUBgsAAQwAAQ0ABwIEAAEJFQUBChYABQQAAQUAAg0ACQ8bCBAcCAEQHQAECCEADiIAESMAEiQAAQQAAQEEAAEJCDQACjcAETUAEjYAEzMAFDgAFTkAFjoAFzsAAAAAAw0AEioAEysAFAAAAAMNABIqABMrABQBBAABAQQAAQMNABkqABorABsAAAADDQAZKgAaKwAbAQQAAQEEAAEDDQAgKgAhKwAiAAAAAw0AICoAISsAIgAAAAMNACgqACkrACoAAAADDQAoKgApKwAqAQMAAQEDAAEFDQAvKgAyKwAzbAAwbQAxAAAAAAAFDQAvKgAyKwAzbAAwbQAxAwUAAgsAAQwAAQMFAAILAAEMAAEDDQA4KgA5KwA6AAAAAw0AOCoAOSsAOgIEAAEJzgEFAgQAAQnUAQUDDQA_KgBAKwBBAAAAAw0APyoAQCsAQQIEAAEFAAICBAABBQACAw0ARioARysASAAAAAMNAEYqAEcrAEgDBAABBQACBgADAwQAAQUAAgYAAwUNAE0qAFArAFFsAE5tAE8AAAAAAAUNAE0qAFArAFFsAE5tAE8DBAABBQACD5ICCAMEAAEFAAIPmAIIBQ0AVioAWSsAWmwAV20AWAAAAAAABQ0AVioAWSsAWmwAV20AWBgCARk8ARo_ARtAARxBAR5DAR9FDiBGDyFIASJKDiNLECZMASdNAShODixRES1SFS5TCy9UCzBVCzFWCzJXCzNZCzRbDjVcFjZeCzdgDjhhFzliCzpjCztkDjxnGD1oHD5pDD9qDEBrDEFsDEJtDENvDERxDkVyHUZ0DEd2Dkh3Hkl4DEp5DEt6Dkx9H01-I06AASRPgQEkUIQBJFGFASRShgEkU4gBJFSKAQ5ViwElVo0BJFePAQ5YkAEmWZEBJFqSASRbkwEOXJYBJ12XAStemAECX5kBAmCaAQJhmwECYpwBAmOeAQJkoAEOZaEBLGajAQJnpQEOaKYBLWmnAQJqqAECa6kBDm6sAS5vrQE0cK4BBXGvAQVysAEFc7EBBXSyAQV1tAEFdrYBDne3ATV4uQEFebsBDnq8ATZ7vQEFfL4BBX2_AQ5-wgE3f8MBO4ABxAEGgQHFAQaCAcYBBoMBxwEGhAHIAQaFAcoBBoYBzAEOhwHNATyIAdABBokB0gEOigHTAT2LAdUBBowB1gEGjQHXAQ6OAdoBPo8B2wFCkAHcAQORAd0BA5IB3gEDkwHfAQOUAeABA5UB4gEDlgHkAQ6XAeUBQ5gB5wEDmQHpAQ6aAeoBRJsB6wEDnAHsAQOdAe0BDp4B8AFFnwHxAUmgAfIBBKEB8wEEogH0AQSjAfUBBKQB9gEEpQH4AQSmAfoBDqcB-wFKqAH9AQSpAf8BDqoBgAJLqwGBAgSsAYICBK0BgwIOrgGGAkyvAYcCUrABiAIIsQGJAgiyAYoCCLMBiwIItAGMAgi1AY4CCLYBkAIOtwGRAlO4AZQCCLkBlgIOugGXAlS7AZkCCLwBmgIIvQGbAg6-AZ4CVb8BnwJb"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EventScalarFieldEnum: () => EventScalarFieldEnum,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  ParticipantScalarFieldEnum: () => ParticipantScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Event: "Event",
  Invitation: "Invitation",
  Notification: "Notification",
  Participant: "Participant",
  Payment: "Payment",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  role: "role",
  status: "status",
  phone: "phone",
  image: "image",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  bgimage: "bgimage",
  isActive: "isActive",
  emailVerified: "emailVerified",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EventScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  date: "date",
  time: "time",
  venue: "venue",
  image: "image",
  visibility: "visibility",
  priceType: "priceType",
  status: "status",
  is_featured: "is_featured",
  categories: "categories",
  fee: "fee",
  organizerId: "organizerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvitationScalarFieldEnum = {
  id: "id",
  eventId: "eventId",
  inviterId: "inviterId",
  inviteeId: "inviteeId",
  status: "status",
  createdAt: "createdAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  message: "message",
  type: "type",
  read: "read",
  invitationId: "invitationId",
  createdAt: "createdAt"
};
var ParticipantScalarFieldEnum = {
  id: "id",
  userId: "userId",
  eventId: "eventId",
  status: "status",
  paymentStatus: "paymentStatus",
  joinedAt: "joinedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  eventId: "eventId",
  stripeEventId: "stripeEventId",
  transactionId: "transactionId",
  paymentGatewayData: "paymentGatewayData",
  amount: "amount",
  status: "status",
  participantId: "participantId",
  createdAt: "createdAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  eventId: "eventId",
  rating: "rating",
  comment: "comment",
  parentId: "parentId",
  status: "status",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var EventType = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};
var PricingType = {
  FREE: "FREE",
  PAID: "PAID"
};
var ParticipantStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  BANNED: "BANNED"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  FREE: "FREE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import ejs from "ejs";
import status3 from "http-status";
import nodemailer from "nodemailer";
import path2 from "path";
var smtpPort = Number(envVars.EMAIL_SENDER.SMTP_PORT);
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: smtpPort,
  // Port 465 expects implicit TLS (secure=true). Port 587/25 typically uses STARTTLS (secure=false).
  secure: smtpPort === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  socketTimeout: 3e4
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: `Planora <${envVars.EMAIL_SENDER.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    });
    throw new AppError_default(status3.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: `${envVars.BETTER_AUTH_URL}/api/auth`,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  appName: "Planora",
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      emailVerified: {
        type: "boolean",
        returned: true,
        defaultValue: false
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          if (type === "email-verification") {
            const user = await prisma.user.findUnique({
              where: {
                email
              }
            });
            if (user?.role === "ADMIN") {
              await prisma.user.update({
                where: {
                  email
                },
                data: {
                  emailVerified: true
                }
              });
            }
            if (user && !user.emailVerified) {
              sendEmail({
                to: email,
                subject: "Verify your email",
                templateName: "otp",
                templateData: {
                  name: user.name,
                  otp
                }
              });
            }
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 4 * 60,
      // 4 minutes in seconds
      otpLength: 6,
      resendStrategy: "rotate"
    })
  ],
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  },
  redirectURLs: {
    signin: `${envVars.BETTER_AUTH_URL}`
  }
});

// src/app.ts
import path3 from "path";
import cors from "cors";

// src/app/middleware/globalErrorHandeller.ts
import status6 from "http-status";

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/errorHelper/handleerror.ts
import status5 from "http-status";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status4 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 6e4
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status4.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/app/errorHelper/handleerror.ts
var handleZodError = (err) => {
  const statusCode = status5.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      message: issue.message
    });
  });
  for (const issue of err.issues) {
    if (issue.path && issue.path.includes("image")) {
      const urlMatch = typeof issue.message === "string" ? issue.message.match(/https?:\/\/[^\s'"]+/) : null;
      if (urlMatch && urlMatch[0]) {
        const imageUrl = urlMatch[0];
        deleteFileFromCloudinary(imageUrl).catch(() => {
        });
      }
    }
  }
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandeller.ts
import z from "zod";
function errorHandler(err, req, res, next) {
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status6.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status6.BAD_REQUEST;
    message = err.message;
    errorSources.push({ message: err.message });
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  }
  if (req.file && req.file.path) {
    if (req.file?.path) {
      deleteFileFromCloudinary(req.file.path);
    }
  }
  sendResponse(res, {
    success: false,
    message,
    httpStatusCode: statusCode,
    data: { errorSources, stack: process.env.NODE_ENV === "development" ? err.stack : stack }
  });
}
var globalErrorHandeller_default = errorHandler;

// src/app/routes/index.ts
import { Router as Router6 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch",
        error: error.message
      });
    }
  };
};

// src/app/modules/auth/auth.controller.ts
import status8 from "http-status";

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: 60 }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 60 * 24
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 60 * 24 * 1e3
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 60 * 24
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
import status7 from "http-status";
var UserRegister = async (payload) => {
  const { name, email, password, phone, image } = payload;
  const userExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!image) {
    throw new AppError_default(status7.BAD_REQUEST, "Image is required to register a user.");
  }
  if (userExist) {
    throw new AppError_default(409, "user already exist,please try another email");
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      phone,
      image
    }
  });
  console.log(data, "data");
  if (!data.user) {
    throw new AppError_default(400, "User register failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status7.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status7.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      events: {
        include: {
          reviews: true
        }
      }
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  const userid = isUserExists.id;
  const ratings = await prisma.review.groupBy({
    by: ["eventId"],
    where: {
      userId: userid,
      rating: {
        gt: 0
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    ...isUserExists,
    totalReview: totalReview || 0,
    averageRating: Number(averageRating.toFixed(1)) || 0
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status7.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!result) {
    throw new AppError_default(400, "user change password failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  console.log(email, otp, newPassword, "passwrd");
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var sendOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status7.NOT_FOUND, "User not found");
  }
  if (user.emailVerified) {
    throw new AppError_default(status7.BAD_REQUEST, "Email already verified");
  }
  const result = await auth.api.sendVerificationOTP({
    body: {
      email,
      // required
      type: "email-verification"
      // required
    }
  });
  return result;
};
var googleLoginSuccess = async (session) => {
  const isPatientExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isPatientExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: ""
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  UserRegister,
  loginUser,
  getMe,
  changePassword,
  logoutUser,
  forgetPassword,
  resetPassword,
  verifyEmail,
  googleLoginSuccess,
  sendOtp
};

// src/app/modules/auth/auth.controller.ts
var UserRegister2 = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await AuthService.UserRegister(payload);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "user registered successfully",
    data: result
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User logged in successfully",
    data: result
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const data = await AuthService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User data retrieved successfully",
    data
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await AuthService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var sendOtp2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.sendOtp(email);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "OTP sent to email successfully"
  });
});
var googleLogin = catchAsync((req, res) => {
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  console.log(sessionToken, "sessionToken");
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  UserRegister: UserRegister2,
  loginUser: loginUser2,
  getMe: getMe2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  verifyEmail: verifyEmail2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError,
  sendOtp: sendOtp2
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body?.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (e) {
        return next(new Error("Invalid JSON in 'data' field"));
      }
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/auth/auth.validation.ts
import { z as z2 } from "zod";
var createUserSchema = z2.object({
  name: z2.string().min(2, "Name must be at least 2 characters"),
  email: z2.string().email("Invalid email address"),
  password: z2.string().min(8, "Password must be at least 8 characters"),
  phone: z2.string().optional(),
  image: z2.any()
});

// src/app/middleware/Auth.ts
import status9 from "http-status";
var auth2 = (roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );
      if (!sessionToken) {
        throw new AppError_default(
          status9.UNAUTHORIZED,
          "Unauthorized access! No session token provided."
        );
      }
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: /* @__PURE__ */ new Date()
            }
          },
          include: {
            user: true
          }
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
          const now = /* @__PURE__ */ new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = timeRemaining / sessionLifeTime * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
            console.log("Session Expiring Soon!!");
          }
          if (user.status === "BLOCKED" || user.status == "DELETED") {
            throw new AppError_default(
              status9.UNAUTHORIZED,
              "Unauthorized access! User is not active."
            );
          }
          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError_default(
              status9.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource."
            );
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email
          };
        }
        const accessToken2 = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken2) {
          throw new AppError_default(
            status9.UNAUTHORIZED,
            "Unauthorized access! No access token provided."
          );
        }
      }
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError_default(
          status9.UNAUTHORIZED,
          "Unauthorized access! No access token provided."
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      if (!verifiedToken.success) {
        throw new AppError_default(
          status9.UNAUTHORIZED,
          "Unauthorized access! Invalid access token."
        );
      }
      if (roles.length > 0 && !roles.includes(verifiedToken.data.role)) {
        throw new AppError_default(
          status9.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource."
        );
      }
      next();
    } catch (error) {
      throw new AppError_default(status9.BAD_REQUEST, error.message);
    }
  };
};
var Auth_default = auth2;

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    console.log({
      folder: `planora/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    });
    return {
      folder: `planora/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", multerUpload.single("file"), validateRequest(createUserSchema), AuthController.UserRegister);
router.post("/login", AuthController.loginUser);
router.get("/me", Auth_default([Role.ADMIN, Role.USER]), AuthController.getMe);
router.post("/change-password", Auth_default([Role.ADMIN, Role.USER]), AuthController.changePassword);
router.post("/logout", Auth_default([Role.ADMIN, Role.USER]), AuthController.logoutUser);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/send-otp", AuthController.sendOtp);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var AuthRouters = router;

// src/app/modules/event/event.route.ts
import { Router as Router2 } from "express";

// src/app/modules/event/event.controller.ts
import status11 from "http-status";

// src/app/modules/event/event.service.ts
import status10 from "http-status";

// src/app/utils/parseDate.ts
function parseDateForPrisma(dateStr) {
  const parsedDate = new Date(dateStr);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format! Use YYYY-MM-DD or ISO string.");
  }
  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);
  return { gte: startOfDay, lte: endOfDay };
}

// src/app/modules/event/event.service.ts
var createEvent = async (user, payload) => {
  const {
    description,
    date,
    time,
    title,
    visibility,
    priceType,
    venue,
    fee,
    categories,
    image
  } = payload;
  if (!image) {
    throw new AppError_default(status10.BAD_REQUEST, "Image is required to create an event.");
  }
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      priceType,
      categories,
      venue,
      image,
      visibility,
      fee,
      organizerId: user.userId
    }
  });
  return event;
};
var getAllEvents = async (query, page, limit, skip, sortBy, sortOrder, is_featureddata, search) => {
  const statuses = [
    "DRAFT",
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED"
  ];
  const andConditions = [];
  if (query) {
    const orConditions = [];
    if (query.title) {
      orConditions.push({
        title: {
          contains: query.title,
          mode: "insensitive"
        }
      });
    }
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
    if (query.date) {
      const dateRange = parseDateForPrisma(query.date);
      andConditions.push({ date: dateRange });
    }
    if (search) {
      orConditions.push(
        {
          title: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          venue: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      );
    }
    if (query.description) {
      orConditions.push({
        description: {
          contains: query.description,
          mode: "insensitive"
        }
      });
    }
    if (query.categories) {
      orConditions.push({
        categories: query.categories
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (query?.fee) {
    andConditions.push({
      fee: {
        gte: 1,
        lte: Number(query.fee)
      }
    });
  }
  if (query?.visibility) {
    andConditions.push({
      visibility: query.visibility
    });
  }
  if (query?.priceType) {
    andConditions.push({
      priceType: query.priceType
    });
  }
  if (is_featureddata) {
    andConditions.push({
      is_featured: is_featureddata
    });
  }
  if (query?.status) {
    andConditions.push({
      status: query.status
    });
  }
  const result = {};
  for (const status21 of statuses) {
    const events = await prisma.event.findMany({
      take: limit,
      skip,
      where: { status: status21, AND: andConditions, is_featured: is_featureddata },
      include: {
        reviews: {
          where: { rating: { gt: 0 } }
        },
        organizer: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });
    result[status21] = events.map((event) => {
      const totalReviews = event.reviews.length;
      const avgRating = totalReviews > 0 ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
      return { ...event, avgRating, totalReviews };
    });
  }
  const total = await prisma.event.count({ where: { AND: andConditions } });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getEventsByRole = async (data, userId, role, page, limit, skip, sortBy, sortOrder, search) => {
  const statuses = ["DRAFT", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { venue: { contains: search, mode: "insensitive" } }
    );
    if (orConditions.length > 0) andConditions.push({ OR: orConditions });
  }
  if (data.categories) {
    andConditions.push({ categories: data.categories });
  }
  if (data.date) {
    const dateRange = parseDateForPrisma(data.date);
    andConditions.push({ date: dateRange });
  }
  if (data.createdAt) {
    const createdAtRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: createdAtRange });
  }
  if (data.fee) andConditions.push({ fee: { lte: Number(data.fee) } });
  if (data.visibility) andConditions.push({ visibility: data.visibility });
  if (data.priceType) andConditions.push({ priceType: data.priceType });
  if (data.is_featured !== void 0) {
    andConditions.push({
      is_featured: typeof data.is_featured === "string" ? data.is_featured === "true" : data.is_featured
    });
  }
  if (data.status) andConditions.push({ status: data.status });
  if (data.time) andConditions.push({ time: data.time });
  if (role === "USER") {
    andConditions.push({ organizerId: userId });
  }
  const result = {};
  for (const status21 of statuses) {
    const events = await prisma.event.findMany({
      where: { status: status21, AND: andConditions },
      take: limit,
      skip,
      include: {
        reviews: { where: { rating: { gt: 0 } } },
        organizer: { select: { name: true, email: true, phone: true, image: true } }
      },
      orderBy: sortBy ? { [sortBy]: sortOrder } : { date: "desc" }
    });
    result[status21] = events.map((event) => {
      const totalReviews = event.reviews.length;
      const avgRating = totalReviews > 0 ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
      return { ...event, avgRating, totalReviews };
    });
  }
  const total = await prisma.event.count({ where: { AND: andConditions } });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1))
    }
  };
};
var getSingleEvent = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      reviews: {
        where: { rating: { gt: 0 }, parentId: null },
        include: {
          replies: {
            include: {
              replies: {
                include: {
                  replies: true,
                  user: true
                }
              },
              user: true
            }
          },
          user: true
        }
      },
      organizer: true
    }
  });
  if (!event) {
    throw new AppError_default(404, "event not found");
  }
  const totalReviews = event.reviews.length || 0;
  const avgRating = totalReviews > 0 ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  return {
    ...event,
    avgRating,
    totalReviews
  };
};
var calculateReviewStats = (event) => {
  const totalReviews = event.reviews.length;
  const avgRating = totalReviews ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const { reviews, ...eventData } = event;
  return { ...eventData, avgRating, totalReviews };
};
var GetPaidAndFreeEvent = async (page, limit, skip, sortBy, sortOrder) => {
  const PublicPaidEventRaw = await prisma.event.findMany({
    take: limit,
    skip,
    where: {
      visibility: "PUBLIC",
      priceType: "PAID"
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const PublicPaidEvent = PublicPaidEventRaw.map(calculateReviewStats);
  const PublicFreeEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PUBLIC",
      priceType: "FREE"
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });
  const PublicFreeEvent = PublicFreeEventRaw.map(calculateReviewStats);
  const PrivateFreeEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PRIVATE",
      priceType: "FREE"
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });
  const PrivateFreeEvent = PrivateFreeEventRaw.map(calculateReviewStats);
  const PrivatePaidEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PRIVATE",
      priceType: "PAID"
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });
  const PrivatePaidEvent = PrivatePaidEventRaw.map(calculateReviewStats);
  return {
    PublicPaidEvent,
    PublicFreeEvent,
    PrivateFreeEvent,
    PrivatePaidEvent,
    pagination: {
      page,
      limit
    }
  };
};
var updateEvent = async (eventId, payload, email) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  const userExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!userExist) {
    throw new AppError_default(404, "User not found");
  }
  if (payload.is_featured && userExist.role !== "ADMIN") {
    throw new AppError_default(403, "You are not authorized to feature this event");
  }
  if (!event) {
    throw new AppError_default(404, "Event not found");
  }
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: payload.title,
      description: payload.description,
      time: payload.time,
      date: payload.date,
      fee: payload.fee,
      visibility: payload.visibility,
      venue: payload.venue,
      status: payload.status,
      priceType: payload.priceType,
      categories: payload.categories,
      is_featured: payload.is_featured
    }
  });
  return updatedEvent;
};
var DeleteEvent = async (user, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(404, "Event not found");
  }
  if (user.role !== "ADMIN" && event.organizerId !== user.userId) {
    throw new AppError_default(400, "the event is not own event");
  }
  if (user.role === "ADMIN") {
    const Deletedevent2 = await prisma.event.delete({
      where: { id: eventId }
    });
    return Deletedevent2;
  }
  const Deletedevent = await prisma.event.delete({
    where: { id: eventId }
  });
  return Deletedevent;
};
var IsFeautured = async () => {
  const featuredEvents = await prisma.event.findMany({
    where: {
      is_featured: true
    },
    orderBy: {
      date: "asc"
    }
  });
  return featuredEvents;
};
var EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  DeleteEvent,
  GetPaidAndFreeEvent,
  getEventsByRole,
  IsFeautured
};

// src/app/helpers/paginationHelping.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 12;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelping_default = paginationSortingHelper;

// src/app/modules/event/event.controller.ts
var createEvent2 = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const user = req.user;
  const result = await EventServices.createEvent(user, payload);
  sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Event created successfully",
    data: result
  });
});
var getAllEvents2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const { search } = req.query;
  const { is_featured } = req.query;
  const is_featureddata = is_featured ? req.query.is_featured === "true" ? true : req.query.is_featured === "false" ? false : void 0 : void 0;
  const events = await EventServices.getAllEvents(req.query, page, limit, skip, sortBy, sortOrder, is_featureddata, search);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "All events fetched successfully",
    data: events
  });
});
var getEventsByRoleController = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const userId = req.user.userId;
  const role = req.user.role;
  const search = req.query?.search;
  const events = await EventServices.getEventsByRole(
    req.query,
    userId,
    role,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Events fetched based on role successfully",
    data: events
  });
});
var getSingleEvent2 = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const event = await EventServices.getSingleEvent(eventId);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "single Event fetched successfully",
    data: event
  });
});
var getPaidAndFreeEvent = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const events = await EventServices.GetPaidAndFreeEvent(page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Paid and Free events fetched successfully",
    data: events
  });
});
var updateEvent2 = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;
  const updatedEvent = await EventServices.updateEvent(eventId, req.body, user.email);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Event updated successfully",
    data: updatedEvent
  });
});
var DeletedEvent = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const deletedEvent = await EventServices.DeleteEvent(req.user, eventId);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Event deleted successfully"
  });
});
var IsFeautured2 = catchAsync(async (req, res) => {
  const featuredEvents = await EventServices.IsFeautured();
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Featured events fetched successfully",
    data: featuredEvents
  });
});
var EventController = { createEvent: createEvent2, getAllEvents: getAllEvents2, getSingleEvent: getSingleEvent2, updateEvent: updateEvent2, DeletedEvent, getPaidAndFreeEvent, getEventsByRoleController, IsFeautured: IsFeautured2 };

// src/app/modules/event/event.validation.ts
import { z as z3 } from "zod";
var EventCategoryEnum = z3.enum([
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
  "TRAVEL_MEETUP"
]);
var EventStatusEnum = z3.enum([
  "DRAFT",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED"
]).default("UPCOMING");
var getEventsSchema = z3.object({
  createdAt: z3.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string"
  }).transform((val) => new Date(val).toISOString())
});
var CreateEventSchema = z3.object({
  title: z3.string().min(3, "Title must be at least 3 characters"),
  description: z3.string().min(10, "Description must be at least 10 characters"),
  categories: EventCategoryEnum,
  date: z3.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }).transform((val) => new Date(val).toISOString()),
  time: z3.string().min(1, "Time is required"),
  venue: z3.string().min(3, "Venue is required"),
  image: z3.any(),
  visibility: z3.enum(EventType).default("PUBLIC"),
  priceType: z3.enum(PricingType).default("FREE"),
  fee: z3.coerce.number().optional(),
  status: EventStatusEnum.default("UPCOMING"),
  is_featured: z3.boolean().optional().default(false)
});
var UpdateEventSchema = CreateEventSchema.partial();

// src/app/modules/event/event.route.ts
var router2 = Router2();
router2.post(
  "/event",
  Auth_default([Role.ADMIN, Role.USER]),
  multerUpload.single("file"),
  validateRequest(CreateEventSchema),
  EventController.createEvent
);
router2.get("/event/isfeatured", EventController.IsFeautured);
router2.get("/events", EventController.getAllEvents);
router2.get("/my-events", Auth_default([Role.USER, Role.ADMIN]), EventController.getEventsByRoleController);
router2.get("/events/paidandfree", EventController.getPaidAndFreeEvent);
router2.get("/event/:id", EventController.getSingleEvent);
router2.put("/event/:id", Auth_default([Role.ADMIN, Role.USER]), validateRequest(UpdateEventSchema), EventController.updateEvent);
router2.delete("/event/:id", Auth_default([Role.ADMIN, Role.USER]), EventController.DeletedEvent);
var EventRouters = router2;

// src/app/modules/Invitations/invitations.route.ts
import { Router as Router3 } from "express";

// src/app/modules/Invitations/invitations.validation.ts
import { z as z4 } from "zod";
var createInvitationSchema = z4.object({
  inviteeId: z4.array(z4.string()),
  message: z4.string().optional(),
  eventId: z4.string()
});
var updateInvitationSchema = z4.object({
  status: z4.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional(),
  message: z4.string().optional()
});

// src/app/modules/Invitations/invitations.service.ts
var createInvitationService = async (inviterId, data) => {
  const { inviteeId, message, eventId } = data;
  if (!eventId) {
    throw new Error("Event ID is required");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true }
  });
  if (!event) {
    throw new AppError_default(404, `Event with id ${eventId} does not exist`);
  }
  const validUsers = await prisma.user.findMany({
    where: { id: { in: inviteeId } },
    select: { id: true }
  });
  const validUserIds = validUsers.map((u) => u.id);
  const invalidIds = inviteeId.filter((id) => !validUserIds.includes(id));
  if (invalidIds.length) {
    throw new AppError_default(
      400,
      `These invitee IDs do not exist: ${invalidIds.join(", ")}`
    );
  }
  const existingInvitations = await prisma.invitation.findMany({
    where: {
      eventId,
      inviterId,
      inviteeId: { in: inviteeId }
    },
    select: { inviteeId: true }
  });
  const existingIds = existingInvitations.map((inv) => inv.inviteeId);
  const newInvitees = inviteeId.filter((id) => !existingIds.includes(id));
  if (newInvitees.length === 0) {
    throw new AppError_default(
      400,
      `All specified users have already been invited: ${existingIds.join(", ")}`
    );
  }
  const invitations = await Promise.all(
    newInvitees.map(
      (inviteeId2) => prisma.invitation.create({
        data: {
          eventId,
          inviterId,
          inviteeId: inviteeId2
        }
      })
    )
  );
  const notifications = await Promise.all(
    invitations.map(
      (inv) => prisma.notification.create({
        data: {
          userId: inv.inviteeId,
          message: message || "You have a new invitation for an event.",
          type: "INVITATION",
          invitationId: inv.id
        }
      })
    )
  );
  return { invitations, notifications };
};
var getInvitationsService = async (userId, page, limit, skip, sortBy, sortOrder, query, role) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  const andConditions = [];
  if (query) {
    if (query.eventId) {
      andConditions.push({ eventId: query.eventId });
    }
    if (query.inviterId) {
      andConditions.push({ inviterId: query.inviterId });
    }
    if (query.inviteeId) {
      andConditions.push({ inviteeId: query.inviteeId });
    }
    if (query.status) {
      andConditions.push({ status: query.status });
    }
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange });
    }
  }
  if (user.role === "ADMIN") {
    const allInvitations = await prisma.invitation.findMany({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      include: {
        event: true,
        inviter: true,
        invitee: true
      },
      orderBy: { [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc" },
      skip: skip ?? 0,
      take: limit ?? 10
    });
    const total = await prisma.invitation.count({
      where: andConditions.length > 0 ? { AND: andConditions } : {}
    });
    return {
      invitations: allInvitations,
      pagination: {
        total,
        page: page ?? 1,
        limit: limit ?? 10,
        totalPages: Math.ceil(total / (limit ?? 10))
      }
    };
  }
  const [receivedInvitations, sentInvitations] = await Promise.all([
    prisma.invitation.findMany({
      where: { inviteeId: userId, ...andConditions.length > 0 ? { AND: andConditions } : {} },
      include: {
        event: true,
        inviter: true
      },
      orderBy: { [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc" },
      skip: skip ?? 0,
      take: limit ?? 10
    }),
    prisma.invitation.findMany({
      where: { inviterId: userId, ...andConditions.length > 0 ? { AND: andConditions } : {} },
      include: {
        event: true,
        invitee: true
      },
      orderBy: { [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc" },
      skip: skip ?? 0,
      take: limit ?? 10
    })
  ]);
  const [receivedInvitationsCount, sentInvitationsCount] = await Promise.all([
    prisma.invitation.count({
      where: { inviteeId: userId, ...andConditions.length > 0 ? { AND: andConditions } : {} }
    }),
    prisma.invitation.count({
      where: { inviterId: userId, ...andConditions.length > 0 ? { AND: andConditions } : {} }
    })
  ]);
  return {
    receivedInvitations,
    sentInvitations,
    receivedPagination: {
      total: receivedInvitationsCount,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(receivedInvitationsCount / (limit ?? 10))
    },
    sentPagination: {
      total: sentInvitationsCount,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(sentInvitationsCount / (limit ?? 10))
    }
  };
};
var getSingleInvitationService = async (id) => {
  const result = await prisma.invitation.findUnique({
    where: { id },
    include: {
      event: { select: { id: true, title: true, date: true, venue: true } },
      inviter: { select: { id: true, name: true, email: true, image: true } },
      invitee: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  if (!result) {
    throw new AppError_default(404, "invitation not found");
  }
  return result;
};
var updateInvitationService = async (id, data, userId) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  const userexist = await prisma.user.findUnique({ where: { id: userId } });
  if (invitation?.inviterId !== userId && userexist?.role !== "ADMIN") {
    throw new AppError_default(400, "you are not valid user for invitation, can update invitation just owner and admin");
  }
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);
  const updateInv = await prisma.invitation.update({
    where: { id },
    data,
    select: {
      notifications: {
        select: {
          id: true
        }
      }
    }
  });
  await prisma.notification.deleteMany({
    where: {
      invitationId: id,
      userId: invitation.inviteeId
    }
  });
  return updateInv;
};
var deleteInvitationService = async (id, userId) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  const userexist = await prisma.user.findUnique({ where: { id: userId } });
  if (invitation?.inviterId !== userId && userexist?.role !== "ADMIN") {
    throw new AppError_default(400, "you are not valid user for invitation, can delete invitation just owner and admin");
  }
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);
  return await prisma.invitation.delete({ where: { id } });
};
var invitationsServices = {
  createInvitationService,
  getInvitationsService,
  getSingleInvitationService,
  deleteInvitationService,
  updateInvitationService
};

// src/app/modules/Invitations/invitations.controller.ts
import status12 from "http-status";
var CreateInvitation = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await invitationsServices.createInvitationService(user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "invitations created successfully",
    data: result
  });
});
var getInvitationsService2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await invitationsServices.getInvitationsService(
    req.user.userId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: `Invitations for user ${req.user.userId} fetched successfully`,
    data: result
  });
});
var GetSingleInvitationController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await invitationsServices.getSingleInvitationService(id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "single Invitation fetched successfully",
    data: result
  });
});
var deleteInvitation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await invitationsServices.deleteInvitationService(id, req.user.userId);
  sendResponse(res, { httpStatusCode: status12.OK, success: true, message: "Invitation deleted", data: result });
});
var updateInvitation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await invitationsServices.updateInvitationService(id, req.body, req.user.userId);
  sendResponse(res, { httpStatusCode: status12.OK, success: true, message: "Invitation updated", data: result });
});
var InvitationController = {
  CreateInvitation,
  getInvitationsService: getInvitationsService2,
  GetSingleInvitationController,
  deleteInvitation,
  updateInvitation
};

// src/app/modules/Invitations/invitations.route.ts
var router3 = Router3();
router3.post("/invitation", Auth_default([Role.ADMIN, Role.USER]), InvitationController.CreateInvitation);
router3.get("/invitation/user", Auth_default([Role.ADMIN, Role.USER]), InvitationController.getInvitationsService);
router3.get("/invitation/:id", InvitationController.GetSingleInvitationController);
router3.put("/invitation/:id", Auth_default([Role.ADMIN, Role.USER]), validateRequest(updateInvitationSchema), InvitationController.updateInvitation);
router3.delete("/invitation/:id", Auth_default([Role.ADMIN, Role.USER]), InvitationController.deleteInvitation);
var InvitationsRouters = router3;

// src/app/modules/Participants/participants.route.ts
import express from "express";

// src/app/modules/Participants/participants.service.ts
import { v6 as uuidv6 } from "uuid";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/modules/Participants/participants.service.ts
import status13 from "http-status";
var createParticipantService = async (userId, eventId, data) => {
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId }
  });
  if (existing?.status === "BANNED") {
    throw new AppError_default(status13.FORBIDDEN, "You have been banned from participating in this event.");
  }
  if (existing) {
    throw new AppError_default(409, "User already joined");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      fee: true,
      date: true,
      venue: true,
      visibility: true,
      priceType: true
    }
  });
  if (!event) {
    throw new AppError_default(404, "Event not found");
  }
  const isFree = Number(event.fee) === 0;
  const finalStatus = isFree ? "APPROVED" : "PENDING";
  const finalPayment = isFree ? "PAID" : "UNPAID";
  if (event.visibility === "PRIVATE" && event.priceType === "FREE") {
    const participantData = await prisma.participant.create({
      data: {
        userId,
        eventId,
        status: "PENDING",
        paymentStatus: finalPayment
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: true
      }
    });
    return participantData;
  }
  const result = await prisma.$transaction(async (tx) => {
    const participantData = await tx.participant.create({
      data: {
        userId,
        eventId,
        status: finalStatus,
        paymentStatus: finalPayment
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: true
      }
    });
    if (isFree) {
      return {
        participantData,
        paymentData: null,
        paymentUrl: null
      };
    }
    const transactionId = String(uuidv6());
    const paymentData = await tx.payment.create({
      data: {
        participantId: participantData.id,
        amount: event.fee,
        transactionId,
        eventId,
        userId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Ticket for ${event.title}`
            },
            unit_amount: event.fee * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        participantId: participantData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.FRONTEND_URL}/user/dashboard/payment-success/${eventId}`,
      cancel_url: `${envVars.FRONTEND_URL}/user/dashboard/payment-failed`
    });
    return {
      participantData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    participant: result.participantData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var getAllParticipantsService = async (userId, page, limit, skip, sortBy, sortOrder, query) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  const EventData = await prisma.event.findMany({ where: {
    organizerId: user?.id
  } });
  const eventIds = EventData.map((event) => event.id);
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  const andConditions = [];
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.joinedAt) {
    const dateRange = parseDateForPrisma(query.joinedAt);
    andConditions.push({ joinedAt: dateRange });
  }
  if (query.paymentStatus) {
    andConditions.push({
      paymentStatus: query.paymentStatus
    });
  }
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  if (user.role === "ADMIN") {
    const result = await prisma.participant.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        "joinedAt": "desc"
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        event: { select: { id: true, title: true, date: true, venue: true } }
      }
    });
    const total = await prisma.participant.count();
    const totalPages = Math.ceil(total / limit);
    return {
      participants: result,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  } else if (user.role === "USER") {
    if (!EventData) {
      return null;
    }
    const result = await prisma.participant.findMany({
      skip,
      take: limit,
      orderBy: {
        "joinedAt": "desc"
      },
      where: { ...where, userId, eventId: { in: eventIds } },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        event: { select: { id: true, title: true, date: true, venue: true } }
      }
    });
    const total = await prisma.participant.count({
      where: { userId }
    });
    const totalPages = Math.ceil(total / limit);
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
};
var getOwnPaymentParticipantService = async (eventId, userId) => {
  const participants = await prisma.participant.findMany({
    where: {
      userId,
      eventId
    },
    include: {
      payment: true,
      event: { select: { id: true, title: true, date: true, venue: true } }
    },
    orderBy: {
      joinedAt: "desc"
    }
  });
  return participants;
};
var ParticipantOwnRequestEventService = async (userId, page, limit, skip, query) => {
  const andConditions = [];
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.joinedAt) {
    const dateRange = parseDateForPrisma(query.joinedAt);
    andConditions.push({ joinedAt: dateRange });
  }
  if (query.paymentStatus) {
    andConditions.push({
      paymentStatus: query.paymentStatus
    });
  }
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const participants = await prisma.participant.findMany({
    where: {
      userId,
      ...where
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          image: true,
          status: true,
          fee: true
        }
      },
      user: true
      // include other relations if needed
    },
    orderBy: {
      joinedAt: "desc"
    }
  });
  return participants;
};
var getSingleParticipantService = async (id) => {
  return await prisma.participant.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, role: true, email: true, image: true }
      },
      event: { select: { id: true, title: true, date: true, venue: true } }
    }
  });
};
var UpdateParticipantService = async (id, data, userId) => {
  const existsParticipant = await prisma.participant.findUnique({
    where: { id }
  });
  if (!existsParticipant) {
    throw new AppError_default(404, "Participant not found");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  let updateData = {};
  if (user.role === "USER") {
    updateData.status = data.status;
  }
  if (user.role === "ADMIN") {
    updateData.status = data.status;
    updateData.paymentStatus = data.paymentStatus;
  }
  const result = await prisma.participant.update({
    where: { id },
    data: updateData
  });
  return result;
};
var deleteParticipantService = async (id) => {
  const existsParticipant = await prisma.participant.findUnique({
    where: { id }
  });
  if (!existsParticipant) {
    throw new AppError_default(404, "participant not found");
  }
  return await prisma.participant.delete({
    where: { id }
  });
};
var deleteEventRequestJoinData = async (id) => {
  const participant = await prisma.participant.findUnique({
    where: { id }
  });
  if (!participant) {
    throw new AppError_default(404, "participant not found");
  }
  if (participant.status !== "PENDING") {
    throw new AppError_default(400, "Only event request participants with status 'PENDING' can be deleted");
  }
  return await prisma.participant.delete({
    where: { id }
  });
};
var createParticipantPayLater = async (userId, eventId) => {
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId }
  });
  if (existing?.status === "PENDING") {
    throw new AppError_default(400, "User already requested to join and is pending approval");
  }
  if (existing?.status === "APPROVED") {
    throw new AppError_default(400, `User already joined and approved for this event`);
  }
  if (existing?.status === "BANNED") {
    throw new AppError_default(400, "User is banned from joining this event");
  }
  if (existing) {
    return { message: "User already requested join", participant: existing };
  }
  const result = await prisma.$transaction(async (tx) => {
    const participantData = await prisma.participant.create({
      data: {
        userId,
        eventId,
        status: "PENDING",
        paymentStatus: "UNPAID"
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: {
          select: { id: true, title: true, date: true, venue: true, fee: true }
        }
      }
    });
    return participantData;
  });
  return result;
};
var initiatePayment = async (eventId, user) => {
  const userdata = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const event = await prisma.event.findUnique({
    where: {
      id: eventId
    }
  });
  if (!event) {
    throw new AppError_default(status13.NOT_FOUND, "Event not found");
  }
  if (event.fee < 60) {
    throw new AppError_default(400, "Minimum amount must be at least 60 BDT");
  }
  const participantData = await prisma.participant.findFirst({
    where: {
      eventId: event.id,
      userId: userdata.id
    },
    include: {
      user: true,
      event: true,
      payment: true
    }
  });
  if (!participantData) {
    throw new AppError_default(status13.NOT_FOUND, "Participant not found for payment initiation");
  }
  if (participantData.payment) {
    throw new AppError_default(status13.BAD_REQUEST, "Payment has already been initiated for this participant. Please proceed with the existing payment or contact support for assistance.");
  }
  if (participantData.status === ParticipantStatus.REJECTED) {
    throw new AppError_default(status13.BAD_REQUEST, "participant is REJECTED");
  }
  const result = await prisma.$transaction(async (tx) => {
    const transactionId = String(uuidv6());
    const paymentData = await tx.payment.create({
      data: {
        participantId: participantData.id,
        amount: event.fee,
        transactionId,
        eventId,
        userId: user.userId
      }
    });
    if (!paymentData) {
      throw new AppError_default(status13.NOT_FOUND, "Payment data not found for this participant");
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Ticket for ${event.title}`
            },
            unit_amount: event.fee * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        participantId: participantData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.FRONTEND_URL}/payment/payment-success/${eventId}`,
      cancel_url: `${envVars.FRONTEND_URL}/payment/payment-failed`
    });
    return {
      participantData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    participant: result.participantData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var ParticipantService = {
  createParticipantService,
  getAllParticipantsService,
  getSingleParticipantService,
  UpdateParticipantService,
  deleteParticipantService,
  createParticipantPayLater,
  initiatePayment,
  getOwnPaymentParticipantService,
  ParticipantOwnRequestEventService,
  deleteEventRequestJoinData
};

// src/app/modules/Participants/participants.controller.ts
import status14 from "http-status";
var createParticipantController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const result = await ParticipantService.createParticipantService(user.userId, id, req.body);
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "Participant created successfully",
    data: result
  });
});
var getAllParticipants = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const participants = await ParticipantService.getAllParticipantsService(req.user.userId, page, limit, skip, sortBy, sortOrder, req.query);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "All participants fetched",
    data: participants
  });
});
var getSingleParticipant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const participant = await ParticipantService.getSingleParticipantService(id);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "single Participant fetched successfully",
    data: participant
  });
});
var updateParticipant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const participant = await ParticipantService.UpdateParticipantService(id, req.body, req.user.userId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Participant updated successfully",
    data: participant
  });
});
var getOwnPayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ParticipantService.getOwnPaymentParticipantService(req.params.id, userId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Fetched own payment participants successfully",
    data: result
  });
});
var deleteParticipant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const participant = await ParticipantService.deleteParticipantService(id);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Participant deleted successfully",
    data: participant
  });
});
var ParticipantCreateWithPayLater = catchAsync(async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const appointment = await ParticipantService.createParticipantPayLater(user.userId, id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.CREATED,
    message: "participant create with pay later successfully",
    data: appointment
  });
});
var deleteEventRequestJoinData2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ParticipantService.deleteEventRequestJoinData(id);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Deleted event request participant successfully",
    data: result
  });
});
var ParticipantOwnRequestEvent = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await ParticipantService.ParticipantOwnRequestEventService(userId, page, limit, skip, req.query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Fetched own participant event requests successfully",
    data: result
  });
});
var initiatePayment2 = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;
  const paymentInfo = await ParticipantService.initiatePayment(eventId, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Payment initiated successfully",
    data: paymentInfo
  });
});
var ParticipantControllers = { createParticipantController, getAllParticipants, getSingleParticipant, updateParticipant, deleteParticipant, ParticipantCreateWithPayLater, initiatePayment: initiatePayment2, getOwnPayment, ParticipantOwnRequestEvent, deleteEventRequestJoinData: deleteEventRequestJoinData2 };

// src/app/modules/Participants/participants.route.ts
var router4 = express.Router();
router4.get("/participant/event/:id/own-payment", Auth_default([Role.USER]), ParticipantControllers.getOwnPayment);
router4.get("/participant/request/event", Auth_default([Role.USER]), ParticipantControllers.ParticipantOwnRequestEvent);
router4.delete("/participant/request/event/:id", Auth_default([Role.USER]), ParticipantControllers.deleteEventRequestJoinData);
router4.post("/participant/event/:id", Auth_default([Role.USER]), ParticipantControllers.createParticipantController);
router4.get("/participants", Auth_default([Role.ADMIN, Role.USER]), ParticipantControllers.getAllParticipants);
router4.get("/participant/:id", ParticipantControllers.getSingleParticipant);
router4.put("/participant/:id", Auth_default([Role.ADMIN, Role.USER]), ParticipantControllers.updateParticipant);
router4.delete("/participant/:id", Auth_default([Role.ADMIN]), ParticipantControllers.deleteParticipant);
router4.post("/participant-with-pay-later/:id", Auth_default([Role.USER]), ParticipantControllers.ParticipantCreateWithPayLater);
router4.post("/initiate-payment/:id", Auth_default([Role.USER]), ParticipantControllers.initiatePayment);
var ParticipantRoutes = router4;

// src/app/modules/reviews/reviews.route.ts
import { Router as Router4 } from "express";

// src/app/modules/reviews/reviews.service.ts
var CreateReviews = async (userId, eventId, data) => {
  const existingmeal = await prisma.event.findUnique({
    where: {
      id: eventId
    }
  });
  if (!existingmeal) {
    throw new AppError_default(404, "meal not found for this id");
  }
  if (data.rating >= 6) {
    throw new AppError_default(400, "rating must be between 1 and 5");
  }
  const result = await prisma.review.create({
    data: {
      userId,
      eventId,
      ...data
    }
  });
  return result;
};
var updateReview = async (reviewId, data, userid) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId: userid
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "your review not found,please update your own review");
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId,
      userId: userid
    },
    data: {
      ...data
    }
  });
  return {
    success: true,
    message: `your review update successfully`,
    result
  };
};
var deleteReview = async (reviewid, userid) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    select: {
      id: true,
      userId: true
    }
  });
  const existUser = await prisma.user.findUnique({ where: { id: userid } });
  if (!review) {
    throw new AppError_default(404, "review not found");
  }
  if (userid !== review.userId && existUser?.role !== "ADMIN") {
    throw new AppError_default(403, "You are not authorized to delete this review");
  }
  const result = await prisma.review.delete({
    where: {
      id: review.id
    }
  });
  return result;
};
var getAllreviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: true,
      event: true,
      replies: true
    }
  });
  return result;
};
var getReviewsByRole = async (role, userId, page = 1, limit = 10, skip = 0, data, sortBy = "createdAt", sortOrder = "desc") => {
  const andConditions = [];
  if (data.parentId !== void 0) {
    andConditions.push({
      parentId: data.parentId
    });
  }
  if (data.status) {
    andConditions.push({
      status: data.status
    });
  }
  if (typeof data.rating === "number") {
    andConditions.push({
      rating: Number(data.rating)
    });
  }
  if (role === "USER") {
    andConditions.push({
      event: {
        organizerId: userId
      }
    });
  } else if (role !== "ADMIN") {
    throw new AppError_default(403, "You are not authorized to view these reviews");
  }
  const whereClause = andConditions.length > 0 ? { AND: andConditions } : void 0;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: whereClause,
      take: limit,
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            ...role === "ADMIN" && { organizerId: true }
          }
        },
        replies: true
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    }),
    prisma.review.count({
      where: whereClause
    })
  ]);
  return {
    data: reviews,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var moderateReview = async (id, data) => {
  const { status: status21 } = data;
  console.log(status21, "s");
  const reviewData = await prisma.review.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!reviewData) {
    throw new AppError_default(404, "review data not found by id");
  }
  if (reviewData.status === data.status) {
    throw new AppError_default(409, `Your provided status (${data.status}) is already up to date.`);
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: status21
    }
  });
  return result;
};
var ReviewsServices = {
  CreateReviews,
  updateReview,
  deleteReview,
  getAllreviews,
  moderateReview,
  getReviewsByRole
};

// src/app/modules/reviews/reviews.controller.ts
import status15 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsServices.CreateReviews(user.userId, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status15.CREATED,
    success: true,
    message: "your review has been created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const { reviewid } = req.params;
  const result = await ReviewsServices.updateReview(reviewid, req.body, user.userId);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "review update successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const { reviewid } = req.params;
    const result = await ReviewsServices.deleteReview(reviewid, user.userId);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "review delete successfully",
      data: result
    });
  }
);
var getAllreviews2 = catchAsync(
  async (req, res) => {
    const result = await ReviewsServices.getAllreviews();
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve all reviews successfully",
      data: result
    });
  }
);
var getReviewsByRole2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsServices.getReviewsByRole(
    user.role,
    user.userId,
    page,
    limit,
    skip,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "retrieve reviews by role successfully",
    data: result
  });
});
var moderateReview2 = catchAsync(async (req, res) => {
  const { reviewid } = req.params;
  const result = await ReviewsServices.moderateReview(reviewid, req.body);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "review moderate successfully",
    data: result
  });
});
var ReviewsControllers = {
  CreateReviews: CreateReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  getAllreviews: getAllreviews2,
  moderateReview: moderateReview2,
  getReviewsByRole: getReviewsByRole2
};

// src/app/modules/reviews/reviews.validation.ts
import z5 from "zod";
var createReviewsData = z5.object({
  rating: z5.number().min(1).max(5),
  comment: z5.string(),
  parentId: z5.string().optional()
});
var updateReviewsData = z5.object({
  rating: z5.number().min(1).max(5).optional(),
  comment: z5.string().optional()
});
var moderateData = z5.object({
  status: z5.enum(["APPROVED", "REJECTED"])
});

// src/app/modules/reviews/reviews.route.ts
var router5 = Router4();
router5.get("/reviews", ReviewsControllers.getAllreviews);
router5.get(
  "/my-reviews",
  Auth_default([Role.USER, Role.ADMIN]),
  ReviewsControllers.getReviewsByRole
);
router5.post("/event/:id/review", validateRequest(createReviewsData), Auth_default([Role.USER]), ReviewsControllers.CreateReviews);
router5.put("/review/:reviewid", Auth_default([Role.USER]), validateRequest(updateReviewsData), ReviewsControllers.updateReview);
router5.delete("/review/:reviewid", Auth_default([Role.ADMIN, Role.USER]), ReviewsControllers.deleteReview);
router5.put("/review/:reviewid/moderate", Auth_default([Role.ADMIN]), ReviewsControllers.moderateReview);
var ReviewsRouters = router5;

// src/app/modules/stats/stats.route.ts
import express2 from "express";

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/app/modules/stats/stats.controller.ts
import status17 from "http-status";

// src/app/modules/stats/stats.service.ts
import status16 from "http-status";
var getDashboardStatsData = async (user) => {
  let statsData;
  switch (user.role) {
    case Role.ADMIN:
      statsData = getAdminDashboardStats();
      break;
    case Role.USER:
      statsData = getUserDashboardStats(user.userId);
      break;
    default:
      throw new AppError_default(status16.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.event.count(),
      prisma.user.count(),
      prisma.participant.count(),
      prisma.invitation.count(),
      prisma.payment.count()
    ]);
    const [eventCount, userCount, participantCount, invitationCount, paymentCount] = counts;
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;
    const [upcomingEvents, completedEvents, cancelledEvents, draftEvetn, ongoingEvent] = await Promise.all([
      prisma.event.count({ where: { status: "UPCOMING" } }),
      prisma.event.count({ where: { status: "COMPLETED" } }),
      prisma.event.count({ where: { status: "CANCELLED" } }),
      prisma.event.count({ where: { status: "DRAFT" } }),
      prisma.event.count({ where: { status: "ONGOING" } })
    ]);
    const [privateEvent, publicEvent] = await Promise.all([
      prisma.event.count({ where: { visibility: "PRIVATE" } }),
      prisma.event.count({ where: { visibility: "PUBLIC" } })
    ]);
    const [freeEvent, paidEvent] = await Promise.all([
      prisma.event.count({ where: { priceType: "FREE" } }),
      prisma.event.count({ where: { priceType: "PAID" } })
    ]);
    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true }
    });
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const monthlyRevenue = {};
    payments.forEach((payment) => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });
    const barChartData = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0
    }));
    const pieChartData = [
      { label: "Upcoming", value: upcomingEvents },
      { label: "Completed", value: completedEvents },
      { label: "Cancelled", value: cancelledEvents },
      { label: "draft", value: draftEvetn },
      { label: "ongoing", value: ongoingEvent }
    ];
    return {
      counts: {
        participatedEvents: participantCount,
        invitations: invitationCount,
        payments: paymentCount,
        user: userCount
      },
      eventVisivillity: {
        public: publicEvent,
        private: privateEvent
      },
      priceType: {
        free: freeEvent,
        paid: paidEvent
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      eventStatus: {
        upcoming: upcomingEvents,
        completed: completedEvents,
        cancelled: cancelledEvents,
        draft: draftEvetn,
        ongoing: ongoingEvent
      },
      pieChartData
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};
var getUserDashboardStats = async (userId) => {
  try {
    const [participatedEventsCount, invitationsCount, paymentsCount] = await prisma.$transaction([
      prisma.participant.count({ where: { userId } }),
      prisma.invitation.count({ where: { inviterId: userId } }),
      prisma.payment.count({ where: { userId } })
    ]);
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { userId, status: PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;
    const [upcomingEvents, completedEvents, cancelledEvents, draftEvent, ongoingEvent] = await Promise.all([
      prisma.participant.count({ where: { userId, event: { status: "UPCOMING" } } }),
      prisma.participant.count({ where: { userId, event: { status: "COMPLETED" } } }),
      prisma.participant.count({ where: { userId, event: { status: "CANCELLED" } } }),
      prisma.participant.count({ where: { userId, event: { status: "DRAFT" } } }),
      prisma.participant.count({ where: { userId, event: { status: "ONGOING" } } })
    ]);
    const [privateEvent, publicEvent] = await Promise.all([
      prisma.event.count({ where: { organizerId: userId, visibility: "PRIVATE" } }),
      prisma.event.count({ where: { organizerId: userId, visibility: "PUBLIC" } })
    ]);
    const [freeEvent, paidEvent] = await Promise.all([
      prisma.event.count({ where: { organizerId: userId, priceType: "FREE" } }),
      prisma.event.count({ where: { organizerId: userId, priceType: "PAID" } })
    ]);
    const payments = await prisma.payment.findMany({
      where: { userId, status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true }
    });
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = {};
    payments.forEach((payment) => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });
    const barChartData = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0
    }));
    const pieChartData = [
      { label: "Upcoming", value: upcomingEvents },
      { label: "Completed", value: completedEvents },
      { label: "Cancelled", value: cancelledEvents },
      { label: "Draft", value: draftEvent },
      { label: "Ongoing", value: ongoingEvent }
    ];
    return {
      counts: {
        participatedEvents: participatedEventsCount,
        invitations: invitationsCount,
        payments: paymentsCount
      },
      eventVisivillity: {
        public: publicEvent,
        private: privateEvent
      },
      priceType: {
        free: freeEvent,
        paid: paidEvent
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      eventStatus: {
        upcoming: upcomingEvents,
        completed: completedEvents,
        cancelled: cancelledEvents,
        draft: draftEvent,
        ongoingEvent
      },
      pieChartData
    };
  } catch (error) {
    console.error("Failed to fetch user dashboard stats:", error);
    throw new Error("Could not fetch user dashboard stats");
  }
};
var statsService = { getDashboardStatsData };

// src/app/modules/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await statsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/app/modules/stats/stats.route.ts
var router6 = express2.Router();
router6.get(
  "/stats",
  Auth_default([Role.USER, Role.ADMIN]),
  StatsController.getDashboardStatsData
);
var StatsRoutes = router6;

// src/app/modules/user/user.route.ts
import { Router as Router5 } from "express";

// src/app/modules/user/user.service.ts
var UpdateUserProfile = async (data, userid) => {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError_default(400, "No profile data provided for update.");
  }
  const user = await prisma.user.findUnique({
    where: { id: userid },
    include: { accounts: true }
  });
  if (!user) {
    throw new AppError_default(404, "User not found.");
  }
  const isUserRole = user.role === "USER";
  const updateData = {
    name: data.name,
    image: data.image,
    bgimage: data.bgimage,
    phone: data.phone,
    isActive: data.isActive,
    ...isUserRole ? {} : { email: data.email }
  };
  const updatedUser = await prisma.user.update({
    where: { id: userid },
    data: updateData
  });
  return updatedUser;
};
var GetAllUsers = async (data, page, limit, skip, sortBy, sortOrder, isemailVerified) => {
  const andCondition = [];
  if (typeof data.email == "string") {
    andCondition.push({
      email: data?.email
    });
  }
  if (typeof data?.phone == "string") {
    andCondition.push({
      phone: data?.phone
    });
  }
  if (typeof data?.name == "string") {
    andCondition.push({
      name: data?.name
    });
  }
  if (typeof data?.role == "string") {
    andCondition.push({ role: data?.role });
  }
  if (typeof data?.status == "string") {
    andCondition.push({ status: data?.status });
  }
  if (typeof data.isactivequery == "boolean") {
    andCondition.push({ isActive: data.isactivequery });
  }
  let result = {};
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    where: { AND: andCondition, emailVerified: isemailVerified },
    include: {
      reviews: {
        where: { rating: { gt: 0 } }
      },
      events: true,
      accounts: { select: { password: true } }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  result = users.map((user) => {
    const totalReviews = user.reviews.length;
    const avgRating = totalReviews > 0 ? user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    return { ...user, avgRating, totalReviews };
  });
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    data: result,
    pagination: {
      totalusers,
      page: data.page,
      limit: data.limit,
      totalpage: Math.ceil(totalusers / data.limit) || 1
    }
  };
};
var OwnProfileDelete = async (userid) => {
  console.log(userid);
  const userData = await prisma.user.findUnique({
    where: { id: userid }
  });
  if (!userData) {
    throw new AppError_default(404, "your user data not found");
  }
  const result = await prisma.user.delete({
    where: { id: userid }
  });
  return result;
};
var UpdateUser = async (id, data) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  if (userData.role == data.role) {
    throw new AppError_default(409, `your status(${data.role}) already up to date`);
  }
  if (userData.status === data.status) {
    throw new AppError_default(409, `your status(${data.status}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: data.role,
      status: data.status,
      email: data.email
    }
  });
  return result;
};
var DeleteUserProfile = async (id) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  const result = await prisma.user.delete({
    where: { id }
  });
  return result;
};
var GetSingleUser = async (id) => {
  const userData = await prisma.user.findUnique({
    where: { id }
  });
  if (!userData) {
    throw new AppError_default(404, "User not found");
  }
  return userData;
};
var UserService = {
  UpdateUserProfile,
  OwnProfileDelete,
  GetAllUsers,
  UpdateUser,
  GetSingleUser,
  DeleteUserProfile
};

// src/app/modules/user/user.controller.ts
import status18 from "http-status";
var UpdateUserProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.UpdateUserProfile(req.body, user.userId);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "User profile updated successfully.",
    data: result
  });
});
var GetAllUsers2 = catchAsync(async (req, res) => {
  const { emailVerified } = req.query;
  const isemailVerified = emailVerified ? req.query.emailVerified === "true" ? true : req.query.emailVerified === "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await UserService.GetAllUsers(req.query, page, limit, skip, sortBy, sortOrder, isemailVerified);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var OwnProfileDelete2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.userId);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "user own account delete successfully",
    data: result
  });
});
var UpdateUser2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: `user change successfully`,
      data: result
    });
  }
);
var DeleteUserProfile2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id);
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "user account delete successfully",
      data: result
    });
  }
);
var GetSingleUser2 = catchAsync(
  async (req, res) => {
    const result = await UserService.GetSingleUser(req.params.id);
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "Single user fetched successfully",
      data: result
    });
  }
);
var UserController = {
  UpdateUserProfile: UpdateUserProfile2,
  OwnProfileDelete: OwnProfileDelete2,
  GetAllUsers: GetAllUsers2,
  UpdateUser: UpdateUser2,
  GetSingleUser: GetSingleUser2,
  DeleteUserProfile: DeleteUserProfile2
};

// src/app/modules/user/user.validation.ts
import z6 from "zod";
var UpdateuserProfileData = z6.object({
  name: z6.string().optional(),
  image: z6.string().optional(),
  bgimage: z6.string().optional(),
  email: z6.string().optional(),
  password: z6.string().min(8).optional(),
  phone: z6.string().min(10).max(15).optional(),
  isActive: z6.boolean().optional()
}).strict();
var UpdateUserCommonData = z6.object({
  role: z6.enum(["ADMIN", "USER"]).optional(),
  status: z6.enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"]).optional(),
  email: z6.string().optional()
}).strict();

// src/app/modules/user/user.route.ts
var router7 = Router5();
router7.get("/admin/users", Auth_default([Role.ADMIN]), UserController.GetAllUsers);
router7.delete("/profile/own", Auth_default([Role.USER]), UserController.OwnProfileDelete);
router7.get(
  "/profile/:id",
  UserController.GetSingleUser
);
router7.put(
  "/profile/update",
  Auth_default([Role.USER, Role.ADMIN]),
  validateRequest(UpdateuserProfileData),
  UserController.UpdateUserProfile
);
router7.put("/admin/profile/:id", Auth_default([Role.ADMIN]), validateRequest(UpdateUserCommonData), UserController.UpdateUser);
router7.delete("/profile/own/delete", Auth_default([Role.USER, Role.ADMIN]), UserController.OwnProfileDelete);
router7.delete("/admin/profile/:id", Auth_default([Role.ADMIN]), UserController.DeleteUserProfile);
var UsersRoutes = router7;

// src/app/modules/notification/notification.route.ts
import express3 from "express";

// src/app/modules/notification/notification.controller.ts
import status19 from "http-status";

// src/app/modules/notification/notification.service.ts
var getUserNotificationsService = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    include: {
      user: true,
      invitation: {
        include: {
          event: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

// src/app/modules/notification/notification.controller.ts
var getUserNotificationsController = catchAsync(async (req, res) => {
  const result = await getUserNotificationsService(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: `Notifications for user ${req.user.userId} fetched successfully`,
    data: result
  });
});
var NotificationController = {
  getUserNotificationsController
};

// src/app/modules/notification/notification.route.ts
var router8 = express3.Router();
router8.get("/notifications", Auth_default([Role.USER]), NotificationController.getUserNotificationsController);
var NotificationRoutes = router8;

// src/app/modules/payment/payment.route.ts
import express4 from "express";

// src/app/modules/payment/payment.controller.ts
import status20 from "http-status";

// src/app/modules/payment/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      if (!participantId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return {
          message: "Missing appointmentId or paymentId in session metadata"
        };
      }
      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId
        }
      });
      if (!participant) {
        console.error(`Appointment with id ${participantId} not found`);
        return { message: `Appointment with id ${participantId} not found` };
      }
      await prisma.$transaction(async (tx) => {
        await tx.participant.update({
          where: {
            id: participantId
          },
          data: {
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            stripeEventId: event.id,
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session
          }
        });
      });
      console.log(
        `Processed checkout.session.completed for appointment ${participantId} and payment ${paymentId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({ where: { id: paymentId }, data: { status: "UNPAID" } });
        await tx.participant.update({
          where: { id: participantId },
          data: { paymentStatus: "UNPAID", status: "REJECTED" }
        });
      });
      await cleanupUnpaidPaymentsAndParticipants();
      break;
    }
    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var cleanupUnpaidPaymentsAndParticipants = async () => {
  const deletedPayments = await prisma.payment.deleteMany({
    where: { status: "UNPAID" }
  });
  const deletedParticipants = await prisma.participant.deleteMany({
    where: { paymentStatus: "UNPAID" }
  });
  console.log(
    `Cleanup done: ${deletedPayments.count} payments and ${deletedParticipants.count} participants deleted`
  );
};
var getAllPaymentsService = async (userId, page, limit, skip, sortBy, sortOrder, query) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admin can access all payments");
  }
  const filters = [];
  if (query.status) filters.push({ status: query.status });
  if (query.amount) filters.push({ amount: Number(query.amount) });
  if (query.paymentStatus) filters.push({ status: query.paymentStatus });
  if (query.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    filters.push({ createdAt: dateRange });
  }
  if (query.userId) filters.push({ userId: query.userId });
  if (query.eventId) filters.push({ eventId: query.eventId });
  const whereOptions = filters.length ? { AND: filters } : {};
  ;
  const payments = await prisma.payment.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: { "createdAt": "desc" },
    include: {
      event: true,
      participant: true,
      user: true
    }
  });
  const total = await prisma.payment.count({ where: whereOptions });
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updatePaymentStatusWithParticipantCheck = async (paymentId, newStatus) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { participant: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (!payment.participant) {
    throw new Error("Associated participant not found");
  }
  const [updatedPayment, updatedParticipant] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus }
    }),
    prisma.participant.update({
      where: { id: payment.participant.id },
      data: { paymentStatus: newStatus }
    })
  ]);
  return {
    payment: updatedPayment,
    participant: updatedParticipant
  };
};
var deletePayment = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { participant: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (!payment.participant) {
    throw new Error("Associated participant not found");
  }
  const [deletedPayment, updatedParticipant] = await prisma.$transaction([
    prisma.payment.delete({
      where: { id: paymentId }
    }),
    prisma.participant.update({
      where: { id: payment.participant.id },
      data: { paymentStatus: "UNPAID" }
    })
  ]);
  return {
    payment: deletedPayment,
    participant: updatedParticipant
  };
};
var PaymentService = {
  handlerStripeWebhookEvent,
  getAllPaymentsService,
  updatePaymentStatusWithParticipantCheck,
  deletePayment
};

// src/app/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status20.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(status20.BAD_REQUEST).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    sendResponse(res, {
      httpStatusCode: status20.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var getAllPayment = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const payments = await PaymentService.getAllPaymentsService(req.user.userId, page, limit, skip, sortBy, sortOrder, req.query);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "All payment fetched",
    data: payments
  });
});
var updatePaymentStatus = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { status: newStatus } = req.body;
  try {
    const result = await PaymentService.updatePaymentStatusWithParticipantCheck(paymentId, newStatus);
    return sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Payment status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return sendResponse(res, {
      httpStatusCode: status20.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error updating payment status"
    });
  }
});
var deletePayment2 = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const result = await PaymentService.deletePayment(paymentId);
    return sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Payment deleted successfully",
      data: result
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return sendResponse(res, {
      httpStatusCode: status20.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error deleting payment"
    });
  }
});
var PaymentController = {
  handleStripeWebhookEvent,
  getAllPayment,
  updatePaymentStatus,
  deletePayment: deletePayment2
};

// src/app/modules/payment/payment.route.ts
var router9 = express4.Router();
router9.get("/payments", Auth_default([Role.ADMIN]), PaymentController.getAllPayment);
router9.patch(
  "/payments/:paymentId/status",
  Auth_default([Role.ADMIN]),
  PaymentController.updatePaymentStatus
);
router9.delete(
  "/payments/:paymentId",
  Auth_default([Role.ADMIN]),
  PaymentController.deletePayment
);
var PaymentRoutes = router9;

// src/app/modules/cleanup/route.ts
import express5 from "express";
var router10 = express5.Router();
router10.get("/cleanup", async (req, res) => {
  try {
    const deletedPayments = await prisma.payment.deleteMany({ where: { status: "UNPAID" } });
    const deletedParticipants = await prisma.participant.deleteMany({ where: { paymentStatus: "UNPAID" } });
    res.json({ deletedPayments, deletedParticipants });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ error: "Cleanup failed", details: err });
  }
});
var CleanRouter = router10;

// src/app/routes/index.ts
var router11 = Router6();
router11.use("/v1/auth", AuthRouters);
router11.use("/v1", UsersRoutes);
router11.use("/v1", EventRouters);
router11.use("/v1", InvitationsRouters);
router11.use("/v1", ParticipantRoutes);
router11.use("/v1", ReviewsRouters);
router11.use("/v1", StatsRoutes);
router11.use("/v1", NotificationRoutes);
router11.use("/v1", PaymentRoutes);
router11.use("/v1", CleanRouter);
var IndexRouter = router11;

// src/app.ts
var app = express6();
app.use("/api/auth", toNodeHandler(auth));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.post("/webhook", express6.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express6.urlencoded({ extended: true }));
app.use(express6.json());
app.use("/api", IndexRouter);
app.use(globalErrorHandeller_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var server;
var port = 5e3;
var bootstrap = async () => {
  try {
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("uncaughtException", (error) => {
  console.log("uncaught exception detected shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("unhandle rejection detected shutting down server");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("SIGTERM", (error) => {
  console.log("unhandle sigterm detected shutting down server");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
