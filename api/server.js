var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "src/generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [
        "postgresqlExtensions"
      ],
      "clientVersion": "7.5.0",
      "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
      "activeProvider": "postgresql",
      "inlineSchema": `model AIContent {
  id            String   @id @default(uuid())
  prompt        String
  generatedText String   @db.Text
  updatedAt     DateTime @updatedAt
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
}

model User {
  id            String     @id @default(uuid())
  name          String
  email         String     @unique
  role          Role       @default(USER)
  status        UserStatus @default(ACTIVE)
  phone         String?
  image         String
  isDeleted     Boolean    @default(false)
  deletedAt     DateTime?
  bgimage       String?    @default("https://images.pexels.com/photos/4303031/pexels-photo-4303031.jpeg")
  isActive      Boolean    @default(false)
  emailVerified Boolean    @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  plan          PlanType  @default(FREE)
  promptCount   Int       @default(0)
  promptResetAt DateTime?

  // relations
  events              Event[]        @relation("UserEvents")
  participants        Participant[]
  reviews             Review[]
  payments            Payment[]
  blogs               Blog[]
  notifications       Notification[]
  newsletter          Newsletter[]
  invitationsSent     Invitation[]   @relation("Inviter")
  invitationsReceived Invitation[]   @relation("Invitee")
  services            Service[]
  sessions            Session[]
  accounts            Account[]
  highlights          Highlight[]
  categories          Category[]
  aicreations         AIContent[]

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

model Blog {
  id String @id @default(cuid())

  title    String
  content  String
  images   String[]
  authorId String
  author   User     @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  eventId  String
  event    Event?   @relation(fields: [eventId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id        String   @id @default(uuid())
  adminId   String
  name      String   @unique @db.VarChar(150)
  image     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)
  event     Event[]

  @@map("categories")
}

enum Role {
  ADMIN
  USER
  MANAGER
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
  PENDING
}

enum BlogStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum BlogCategory {
  EVENT
  NEWS
  ARTICLE
  REVIEW
  GUIDE
  TUTORIAL
  HOW_TO
  OPINION
  COMMENTARY
  FEATURE
}

enum PlanType {
  FREE
  PREMIUM
}

model Event {
  id            String      @id @default(uuid())
  title         String
  description   String
  date          DateTime
  time          String
  location      String
  images        String[]
  visibility    EventType   @default(PUBLIC)
  priceType     PricingType @default(FREE)
  status        EventStatus @default(UPCOMING)
  is_featured   Boolean?    @default(false)
  category_name String

  category    Category @relation(fields: [category_name], references: [name], onDelete: Cascade)
  fee         Float    @default(0)
  organizerId String
  organizer   User     @relation("UserEvents", fields: [organizerId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  // relations
  participants  Participant[]
  invitations   Invitation[]
  reviews       Review[]
  payments      Payment[]
  blogs         Blog[]
  UserActivitys UserActivity[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Highlight {
  id String @id @default(cuid())

  title       String
  description String
  image       String?
  userId      String
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("highlight")
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

model Newsletter {
  id String @id @default(cuid())

  email     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("newsletter")
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

model DocumentEmbedding {
  id String @id @default(uuid(7))

  chunkKey    String  @unique
  sourceType  String
  sourceId    String
  sourceLabel String?
  content     String
  metadata    Json?

  embedding Unsupported("vector(2048)")

  isDeleted Boolean   @default(false)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([sourceType], name: "idx_document_embeddings_sourceType")
  @@index([sourceId], name: "idx_document_embeddings_sourceId")
  @@map("document_embeddings")
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
  provider        = "prisma-client"
  output          = "../../src/generated/prisma"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  extensions = [vector]
}

model Service {
  id String @id @default(cuid())

  title       String
  description String
  icon        String?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@map("service")
}

model UserActivity {
  id String @id @default(uuid())

  viewerId String
  category String
  eventid  String

  event Event @relation(fields: [eventid], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([viewerId, eventid, category])
  @@index([viewerId])
  @@index([eventid])
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
    config.runtimeDataModel = JSON.parse('{"models":{"AIContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"prompt","kind":"scalar","type":"String"},{"name":"generatedText","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AIContentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"plan","kind":"enum","type":"PlanType"},{"name":"promptCount","kind":"scalar","type":"Int"},{"name":"promptResetAt","kind":"scalar","type":"DateTime"},{"name":"events","kind":"object","type":"Event","relationName":"UserEvents"},{"name":"participants","kind":"object","type":"Participant","relationName":"ParticipantToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"blogs","kind":"object","type":"Blog","relationName":"BlogToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"newsletter","kind":"object","type":"Newsletter","relationName":"NewsletterToUser"},{"name":"invitationsSent","kind":"object","type":"Invitation","relationName":"Inviter"},{"name":"invitationsReceived","kind":"object","type":"Invitation","relationName":"Invitee"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"highlights","kind":"object","type":"Highlight","relationName":"HighlightToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"aicreations","kind":"object","type":"AIContent","relationName":"AIContentToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Blog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"BlogToUser"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"BlogToEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"event","kind":"object","type":"Event","relationName":"CategoryToEvent"}],"dbName":"categories"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"time","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"EventType"},{"name":"priceType","kind":"enum","type":"PricingType"},{"name":"status","kind":"enum","type":"EventStatus"},{"name":"is_featured","kind":"scalar","type":"Boolean"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToEvent"},{"name":"fee","kind":"scalar","type":"Float"},{"name":"organizerId","kind":"scalar","type":"String"},{"name":"organizer","kind":"object","type":"User","relationName":"UserEvents"},{"name":"participants","kind":"object","type":"Participant","relationName":"EventToParticipant"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"EventToInvitation"},{"name":"reviews","kind":"object","type":"Review","relationName":"EventToReview"},{"name":"payments","kind":"object","type":"Payment","relationName":"EventToPayment"},{"name":"blogs","kind":"object","type":"Blog","relationName":"BlogToEvent"},{"name":"UserActivitys","kind":"object","type":"UserActivity","relationName":"EventToUserActivity"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Highlight":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"HighlightToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"highlight"},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"inviterId","kind":"scalar","type":"String"},{"name":"inviteeId","kind":"scalar","type":"String"},{"name":"notifications","kind":"object","type":"Notification","relationName":"InvitationToNotification"},{"name":"event","kind":"object","type":"Event","relationName":"EventToInvitation"},{"name":"inviter","kind":"object","type":"User","relationName":"Inviter"},{"name":"invitee","kind":"object","type":"User","relationName":"Invitee"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Newsletter":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NewsletterToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"newsletter"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"read","kind":"scalar","type":"Boolean"},{"name":"invitation","kind":"object","type":"Invitation","relationName":"InvitationToNotification"},{"name":"invitationId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Participant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ParticipantToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToParticipant"},{"name":"status","kind":"enum","type":"ParticipantStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"payment","kind":"object","type":"Payment","relationName":"ParticipantToPayment"},{"name":"joinedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"participantId","kind":"scalar","type":"String"},{"name":"participant","kind":"object","type":"Participant","relationName":"ParticipantToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DocumentEmbedding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"chunkKey","kind":"scalar","type":"String"},{"name":"sourceType","kind":"scalar","type":"String"},{"name":"sourceId","kind":"scalar","type":"String"},{"name":"sourceLabel","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"document_embeddings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ServiceToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"service"},"UserActivity":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"viewerId","kind":"scalar","type":"String"},{"name":"category","kind":"scalar","type":"String"},{"name":"eventid","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToUserActivity"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
    config.parameterizationSchema = {
      strings: JSON.parse('["where","orderBy","cursor","user","event","_count","category","organizer","participant","payment","participants","invitation","notifications","inviter","invitee","invitations","parent","replies","reviews","payments","author","blogs","UserActivitys","events","newsletter","invitationsSent","invitationsReceived","services","sessions","accounts","highlights","categories","aicreations","AIContent.findUnique","AIContent.findUniqueOrThrow","AIContent.findFirst","AIContent.findFirstOrThrow","AIContent.findMany","data","AIContent.createOne","AIContent.createMany","AIContent.createManyAndReturn","AIContent.updateOne","AIContent.updateMany","AIContent.updateManyAndReturn","create","update","AIContent.upsertOne","AIContent.deleteOne","AIContent.deleteMany","having","_min","_max","AIContent.groupBy","AIContent.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","_avg","_sum","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Blog.findUnique","Blog.findUniqueOrThrow","Blog.findFirst","Blog.findFirstOrThrow","Blog.findMany","Blog.createOne","Blog.createMany","Blog.createManyAndReturn","Blog.updateOne","Blog.updateMany","Blog.updateManyAndReturn","Blog.upsertOne","Blog.deleteOne","Blog.deleteMany","Blog.groupBy","Blog.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.createManyAndReturn","Event.updateOne","Event.updateMany","Event.updateManyAndReturn","Event.upsertOne","Event.deleteOne","Event.deleteMany","Event.groupBy","Event.aggregate","Highlight.findUnique","Highlight.findUniqueOrThrow","Highlight.findFirst","Highlight.findFirstOrThrow","Highlight.findMany","Highlight.createOne","Highlight.createMany","Highlight.createManyAndReturn","Highlight.updateOne","Highlight.updateMany","Highlight.updateManyAndReturn","Highlight.upsertOne","Highlight.deleteOne","Highlight.deleteMany","Highlight.groupBy","Highlight.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Newsletter.findUnique","Newsletter.findUniqueOrThrow","Newsletter.findFirst","Newsletter.findFirstOrThrow","Newsletter.findMany","Newsletter.createOne","Newsletter.createMany","Newsletter.createManyAndReturn","Newsletter.updateOne","Newsletter.updateMany","Newsletter.updateManyAndReturn","Newsletter.upsertOne","Newsletter.deleteOne","Newsletter.deleteMany","Newsletter.groupBy","Newsletter.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Participant.findUnique","Participant.findUniqueOrThrow","Participant.findFirst","Participant.findFirstOrThrow","Participant.findMany","Participant.createOne","Participant.createMany","Participant.createManyAndReturn","Participant.updateOne","Participant.updateMany","Participant.updateManyAndReturn","Participant.upsertOne","Participant.deleteOne","Participant.deleteMany","Participant.groupBy","Participant.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","DocumentEmbedding.findUnique","DocumentEmbedding.findUniqueOrThrow","DocumentEmbedding.findFirst","DocumentEmbedding.findFirstOrThrow","DocumentEmbedding.findMany","DocumentEmbedding.updateOne","DocumentEmbedding.updateMany","DocumentEmbedding.updateManyAndReturn","DocumentEmbedding.deleteOne","DocumentEmbedding.deleteMany","DocumentEmbedding.groupBy","DocumentEmbedding.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","UserActivity.findUnique","UserActivity.findUniqueOrThrow","UserActivity.findFirst","UserActivity.findFirstOrThrow","UserActivity.findMany","UserActivity.createOne","UserActivity.createMany","UserActivity.createManyAndReturn","UserActivity.updateOne","UserActivity.updateMany","UserActivity.updateManyAndReturn","UserActivity.upsertOne","UserActivity.deleteOne","UserActivity.deleteMany","UserActivity.groupBy","UserActivity.aggregate","AND","OR","NOT","id","viewerId","eventid","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","title","description","icon","userId","eventId","rating","comment","parentId","ReviewStatus","status","chunkKey","sourceType","sourceId","sourceLabel","content","metadata","isDeleted","deletedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","stripeEventId","transactionId","paymentGatewayData","amount","PaymentStatus","participantId","ParticipantStatus","paymentStatus","joinedAt","message","type","read","invitationId","email","inviterId","inviteeId","InvitationStatus","image","date","time","location","images","EventType","visibility","PricingType","priceType","EventStatus","is_featured","category_name","fee","organizerId","has","hasEvery","hasSome","adminId","name","authorId","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","Role","role","UserStatus","phone","bgimage","isActive","emailVerified","PlanType","plan","promptCount","promptResetAt","every","some","none","prompt","generatedText","viewerId_eventid_category","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
      graph: "8QmdAZwCCgMAAOEEACDFAgAA4AQAMMYCAABRABDHAgAA4AQAMMgCAQAAAAHLAkAAmgQAIcwCQACaBAAh2wIBAJUEACGyAwEAlQQAIbMDAQCVBAAhAQAAAAEAIBsGAACCBQAgBwAA4QQAIAoAANIEACAPAADYBAAgEgAA0wQAIBMAANQEACAVAADVBAAgFgAAgwUAIMUCAAD9BAAwxgIAAAMAEMcCAAD9BAAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAh2AIBAJUEACHZAgEAlQQAIeECAACABYsDIoIDQACaBAAhgwMBAJUEACGEAwEAlQQAIYUDAACvBAAghwMAAP4EhwMiiQMAAP8EiQMiiwMgAIEFACGMAwEAlQQAIY0DCADuBAAhjgMBAJUEACEJBgAA2wgAIAcAANUIACAKAADDCAAgDwAAyQgAIBIAAMQIACATAADFCAAgFQAAxggAIBYAANwIACCLAwAAiwUAIBsGAACCBQAgBwAA4QQAIAoAANIEACAPAADYBAAgEgAA0wQAIBMAANQEACAVAADVBAAgFgAAgwUAIMUCAAD9BAAwxgIAAAMAEMcCAAD9BAAwyAIBAAAAAcsCQACaBAAhzAJAAJoEACHYAgEAlQQAIdkCAQCVBAAh4QIAAIAFiwMiggNAAJoEACGDAwEAlQQAIYQDAQCVBAAhhQMAAK8EACCHAwAA_gSHAyKJAwAA_wSJAyKLAyAAgQUAIYwDAQCVBAAhjQMIAO4EACGOAwEAlQQAIQMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAMAIAwDAADhBAAgBAAA6gQAIAkAAPwEACDFAgAA-gQAMMYCAAAJABDHAgAA-gQAMMgCAQCVBAAh2wIBAJUEACHcAgEAlQQAIeECAAD7BPcCIvcCAADvBPUCIvgCQACaBAAhAwMAANUIACAEAADWCAAgCQAA2ggAIAwDAADhBAAgBAAA6gQAIAkAAPwEACDFAgAA-gQAMMYCAAAJABDHAgAA-gQAMMgCAQAAAAHbAgEAlQQAIdwCAQCVBAAh4QIAAPsE9wIi9wIAAO8E9QIi-AJAAJoEACEDAAAACQAgAQAACgAwAgAACwAgEAMAAOEEACAEAADqBAAgCAAA8AQAIMUCAADtBAAwxgIAAA0AEMcCAADtBAAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh3AIBAJUEACHhAgAA7wT1AiLwAgEAlgQAIfECAQD4BAAh8gIAAJcEACDzAggA7gQAIfUCAQCVBAAhAQAAAA0AIA0EAADqBAAgDAAA1gQAIA0AAOEEACAOAADhBAAgxQIAAPYEADDGAgAADwAQxwIAAPYEADDIAgEAlQQAIcsCQACaBAAh3AIBAJUEACHhAgAA9wSBAyL-AgEAlQQAIf8CAQCVBAAhBAQAANYIACAMAADHCAAgDQAA1QgAIA4AANUIACANBAAA6gQAIAwAANYEACANAADhBAAgDgAA4QQAIMUCAAD2BAAwxgIAAA8AEMcCAAD2BAAwyAIBAAAAAcsCQACaBAAh3AIBAJUEACHhAgAA9wSBAyL-AgEAlQQAIf8CAQCVBAAhAwAAAA8AIAEAABAAMAIAABEAIAwDAADhBAAgCwAA9QQAIMUCAAD0BAAwxgIAABMAEMcCAAD0BAAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh-QIBAJUEACH6AgEAlQQAIfsCIACYBAAh_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AAADwAgAQAAAD0AIAEAAABBACABAAAARQAgAQAAAEkAIAEAAABNACABAAAAUQAgAQAAAAEAIAMAAABRACABAABSADACAAABACADAAAAUQAgAQAAUgAwAgAAAQAgAwAAAFEAIAEAAFIAMAIAAAEAIAcDAADUCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2wIBAAAAAbIDAQAAAAGzAwEAAAABASYAAGcAIAbIAgEAAAABywJAAAAAAcwCQAAAAAHbAgEAAAABsgMBAAAAAbMDAQAAAAEBJgAAaQAwASYAAGkAMAcDAADTCAAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2wIBAIcFACGyAwEAhwUAIbMDAQCHBQAhAgAAAAEAICYAAGwAIAbIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHbAgEAhwUAIbIDAQCHBQAhswMBAIcFACECAAAAUQAgJgAAbgAgAgAAAFEAICYAAG4AIAMAAAABACAtAABnACAuAABsACABAAAAAQAgAQAAAFEAIAMFAADQCAAgMwAA0ggAIDQAANEIACAJxQIAAN8EADDGAgAAdQAQxwIAAN8EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHbAgEA-AMAIbIDAQD4AwAhswMBAPgDACEDAAAAUQAgAQAAdAAwMgAAdQAgAwAAAFEAIAEAAFIAMAIAAAEAICMKAADSBAAgDAAA1gQAIBIAANMEACATAADUBAAgFQAA1QQAIBcAANEEACAYAADXBAAgGQAA2AQAIBoAANgEACAbAADZBAAgHAAA2gQAIB0AANsEACAeAADcBAAgHwAA3QQAICAAAN4EACDFAgAAzAQAMMYCAAB7ABDHAgAAzAQAMMgCAQAAAAHLAkAAmgQAIcwCQACaBAAh4QIAAM4EpwMi6AIgAJgEACHpAkAAmQQAIf0CAQAAAAGBAwEAlQQAIZMDAQCVBAAhpQMAAM0EpQMipwMBAJYEACGoAwEAlgQAIakDIACYBAAhqgMgAJgEACGsAwAAzwSsAyKtAwIA0AQAIa4DQACZBAAhAQAAAHgAIAEAAAB4ACAjCgAA0gQAIAwAANYEACASAADTBAAgEwAA1AQAIBUAANUEACAXAADRBAAgGAAA1wQAIBkAANgEACAaAADYBAAgGwAA2QQAIBwAANoEACAdAADbBAAgHgAA3AQAIB8AAN0EACAgAADeBAAgxQIAAMwEADDGAgAAewAQxwIAAMwEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHhAgAAzgSnAyLoAiAAmAQAIekCQACZBAAh_QIBAJUEACGBAwEAlQQAIZMDAQCVBAAhpQMAAM0EpQMipwMBAJYEACGoAwEAlgQAIakDIACYBAAhqgMgAJgEACGsAwAAzwSsAyKtAwIA0AQAIa4DQACZBAAhEwoAAMMIACAMAADHCAAgEgAAxAgAIBMAAMUIACAVAADGCAAgFwAAwggAIBgAAMgIACAZAADJCAAgGgAAyQgAIBsAAMoIACAcAADLCAAgHQAAzAgAIB4AAM0IACAfAADOCAAgIAAAzwgAIOkCAACLBQAgpwMAAIsFACCoAwAAiwUAIK4DAACLBQAgAwAAAHsAIAEAAHwAMAIAAHgAIAMAAAB7ACABAAB8ADACAAB4ACADAAAAewAgAQAAfAAwAgAAeAAgIAoAALQIACAMAAC4CAAgEgAAtQgAIBMAALYIACAVAAC3CAAgFwAAswgAIBgAALkIACAZAAC6CAAgGgAAuwgAIBsAALwIACAcAAC9CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABASYAAIABACARyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAEBJgAAggEAMAEmAACCAQAwIAoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACECAAAAeAAgJgAAhQEAIBHIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhAgAAAHsAICYAAIcBACACAAAAewAgJgAAhwEAIAMAAAB4ACAtAACAAQAgLgAAhQEAIAEAAAB4ACABAAAAewAgCQUAAIAHACAzAACDBwAgNAAAggcAIEUAAIEHACBGAACEBwAg6QIAAIsFACCnAwAAiwUAIKgDAACLBQAgrgMAAIsFACAUxQIAAMIEADDGAgAAjgEAEMcCAADCBAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAh4QIAAMQEpwMi6AIgAI0EACHpAkAAjgQAIf0CAQD4AwAhgQMBAPgDACGTAwEA-AMAIaUDAADDBKUDIqcDAQCABAAhqAMBAIAEACGpAyAAjQQAIaoDIACNBAAhrAMAAMUErAMirQMCAIUEACGuA0AAjgQAIQMAAAB7ACABAACNAQAwMgAAjgEAIAMAAAB7ACABAAB8ADACAAB4ACABAAAAQwAgAQAAAEMAIAMAAABBACABAABCADACAABDACADAAAAQQAgAQAAQgAwAgAAQwAgAwAAAEEAIAEAAEIAMAIAAEMAIAkDAAD_BgAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2wIBAAAAAZcDQAAAAAGhAwEAAAABogMBAAAAAaMDAQAAAAEBJgAAlgEAIAjIAgEAAAABywJAAAAAAcwCQAAAAAHbAgEAAAABlwNAAAAAAaEDAQAAAAGiAwEAAAABowMBAAAAAQEmAACYAQAwASYAAJgBADAJAwAA_gYAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdsCAQCHBQAhlwNAAIgFACGhAwEAhwUAIaIDAQCPBQAhowMBAI8FACECAAAAQwAgJgAAmwEAIAjIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHbAgEAhwUAIZcDQACIBQAhoQMBAIcFACGiAwEAjwUAIaMDAQCPBQAhAgAAAEEAICYAAJ0BACACAAAAQQAgJgAAnQEAIAMAAABDACAtAACWAQAgLgAAmwEAIAEAAABDACABAAAAQQAgBQUAAPsGACAzAAD9BgAgNAAA_AYAIKIDAACLBQAgowMAAIsFACALxQIAAMEEADDGAgAApAEAEMcCAADBBAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAh2wIBAPgDACGXA0AA-QMAIaEDAQD4AwAhogMBAIAEACGjAwEAgAQAIQMAAABBACABAACjAQAwMgAApAEAIAMAAABBACABAABCADACAABDACABAAAARwAgAQAAAEcAIAMAAABFACABAABGADACAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIA4DAAD6BgAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2wIBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGcAwEAAAABnQNAAAAAAZ4DQAAAAAGfAwEAAAABoAMBAAAAAQEmAACsAQAgDcgCAQAAAAHLAkAAAAABzAJAAAAAAdsCAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnAMBAAAAAZ0DQAAAAAGeA0AAAAABnwMBAAAAAaADAQAAAAEBJgAArgEAMAEmAACuAQAwDgMAAPkGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHbAgEAhwUAIZgDAQCHBQAhmQMBAIcFACGaAwEAjwUAIZsDAQCPBQAhnAMBAI8FACGdA0AAsQUAIZ4DQACxBQAhnwMBAI8FACGgAwEAjwUAIQIAAABHACAmAACxAQAgDcgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdsCAQCHBQAhmAMBAIcFACGZAwEAhwUAIZoDAQCPBQAhmwMBAI8FACGcAwEAjwUAIZ0DQACxBQAhngNAALEFACGfAwEAjwUAIaADAQCPBQAhAgAAAEUAICYAALMBACACAAAARQAgJgAAswEAIAMAAABHACAtAACsAQAgLgAAsQEAIAEAAABHACABAAAARQAgCgUAAPYGACAzAAD4BgAgNAAA9wYAIJoDAACLBQAgmwMAAIsFACCcAwAAiwUAIJ0DAACLBQAgngMAAIsFACCfAwAAiwUAIKADAACLBQAgEMUCAADABAAwxgIAALoBABDHAgAAwAQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIdsCAQD4AwAhmAMBAPgDACGZAwEA-AMAIZoDAQCABAAhmwMBAIAEACGcAwEAgAQAIZ0DQACOBAAhngNAAI4EACGfAwEAgAQAIaADAQCABAAhAwAAAEUAIAEAALkBADAyAAC6AQAgAwAAAEUAIAEAAEYAMAIAAEcAIAnFAgAAvwQAMMYCAADAAQAQxwIAAL8EADDIAgEAAAABywJAAJoEACHMAkAAmgQAIZUDAQCVBAAhlgMBAJUEACGXA0AAmgQAIQEAAAC9AQAgAQAAAL0BACAJxQIAAL8EADDGAgAAwAEAEMcCAAC_BAAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAhlQMBAJUEACGWAwEAlQQAIZcDQACaBAAhAAMAAADAAQAgAQAAwQEAMAIAAL0BACADAAAAwAEAIAEAAMEBADACAAC9AQAgAwAAAMABACABAADBAQAwAgAAvQEAIAbIAgEAAAABywJAAAAAAcwCQAAAAAGVAwEAAAABlgMBAAAAAZcDQAAAAAEBJgAAxQEAIAbIAgEAAAABywJAAAAAAcwCQAAAAAGVAwEAAAABlgMBAAAAAZcDQAAAAAEBJgAAxwEAMAEmAADHAQAwBsgCAQCHBQAhywJAAIgFACHMAkAAiAUAIZUDAQCHBQAhlgMBAIcFACGXA0AAiAUAIQIAAAC9AQAgJgAAygEAIAbIAgEAhwUAIcsCQACIBQAhzAJAAIgFACGVAwEAhwUAIZYDAQCHBQAhlwNAAIgFACECAAAAwAEAICYAAMwBACACAAAAwAEAICYAAMwBACADAAAAvQEAIC0AAMUBACAuAADKAQAgAQAAAL0BACABAAAAwAEAIAMFAADzBgAgMwAA9QYAIDQAAPQGACAJxQIAAL4EADDGAgAA0wEAEMcCAAC-BAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAhlQMBAPgDACGWAwEA-AMAIZcDQAD5AwAhAwAAAMABACABAADSAQAwMgAA0wEAIAMAAADAAQAgAQAAwQEAMAIAAL0BACABAAAAJQAgAQAAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAACMAIAEAACQAMAIAACUAIAoEAADyBgAgFAAApAYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHcAgEAAAAB5gIBAAAAAYUDAACjBgAglAMBAAAAAQEmAADbAQAgCMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHcAgEAAAAB5gIBAAAAAYUDAACjBgAglAMBAAAAAQEmAADdAQAwASYAAN0BADABAAAAAwAgCgQAAPEGACAUAAChBgAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHcAgEAhwUAIeYCAQCHBQAhhQMAAJ8GACCUAwEAhwUAIQIAAAAlACAmAADhAQAgCMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh3AIBAIcFACHmAgEAhwUAIYUDAACfBgAglAMBAIcFACECAAAAIwAgJgAA4wEAIAIAAAAjACAmAADjAQAgAQAAAAMAIAMAAAAlACAtAADbAQAgLgAA4QEAIAEAAAAlACABAAAAIwAgAwUAAO4GACAzAADwBgAgNAAA7wYAIAvFAgAAvQQAMMYCAADrAQAQxwIAAL0EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdwCAQD4AwAh5gIBAPgDACGFAwAArwQAIJQDAQD4AwAhAwAAACMAIAEAAOoBADAyAADrAQAgAwAAACMAIAEAACQAMAIAACUAIAEAAABPACABAAAATwAgAwAAAE0AIAEAAE4AMAIAAE8AIAMAAABNACABAABOADACAABPACADAAAATQAgAQAATgAwAgAATwAgCAMAAOwGACAEAADtBgAgyAIBAAAAAcsCQAAAAAHMAkAAAAABgQMBAAAAAZIDAQAAAAGTAwEAAAABASYAAPMBACAGyAIBAAAAAcsCQAAAAAHMAkAAAAABgQMBAAAAAZIDAQAAAAGTAwEAAAABASYAAPUBADABJgAA9QEAMAgDAADeBgAgBAAA3wYAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIYEDAQCHBQAhkgMBAIcFACGTAwEAhwUAIQIAAABPACAmAAD4AQAgBsgCAQCHBQAhywJAAIgFACHMAkAAiAUAIYEDAQCHBQAhkgMBAIcFACGTAwEAhwUAIQIAAABNACAmAAD6AQAgAgAAAE0AICYAAPoBACADAAAATwAgLQAA8wEAIC4AAPgBACABAAAATwAgAQAAAE0AIAMFAADbBgAgMwAA3QYAIDQAANwGACAJxQIAALwEADDGAgAAgQIAEMcCAAC8BAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAhgQMBAPgDACGSAwEA-AMAIZMDAQD4AwAhAwAAAE0AIAEAAIACADAyAACBAgAgAwAAAE0AIAEAAE4AMAIAAE8AIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgGAYAANMGACAHAADUBgAgCgAA1QYAIA8AANYGACASAADXBgAgEwAA2AYAIBUAANkGACAWAADaBgAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAdkCAQAAAAHhAgAAAIsDAoIDQAAAAAGDAwEAAAABhAMBAAAAAYUDAADSBgAghwMAAACHAwKJAwAAAIkDAosDIAAAAAGMAwEAAAABjQMIAAAAAY4DAQAAAAEBJgAAiQIAIBDIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAYwDAQAAAAGNAwgAAAABjgMBAAAAAQEmAACLAgAwASYAAIsCADAYBgAAgQYAIAcAAIIGACAKAACDBgAgDwAAhAYAIBIAAIUGACATAACGBgAgFQAAhwYAIBYAAIgGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIQIAAAAFACAmAACOAgAgEMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHhAgAA_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIY4DAQCHBQAhAgAAAAMAICYAAJACACACAAAAAwAgJgAAkAIAIAMAAAAFACAtAACJAgAgLgAAjgIAIAEAAAAFACABAAAAAwAgBgUAAPcFACAzAAD6BQAgNAAA-QUAIEUAAPgFACBGAAD7BQAgiwMAAIsFACATxQIAAK4EADDGAgAAlwIAEMcCAACuBAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAh2AIBAPgDACHZAgEA-AMAIeECAACyBIsDIoIDQAD5AwAhgwMBAPgDACGEAwEA-AMAIYUDAACvBAAghwMAALAEhwMiiQMAALEEiQMiiwMgALMEACGMAwEA-AMAIY0DCACdBAAhjgMBAPgDACEDAAAAAwAgAQAAlgIAMDIAAJcCACADAAAAAwAgAQAABAAwAgAABQAgAQAAAEsAIAEAAABLACADAAAASQAgAQAASgAwAgAASwAgAwAAAEkAIAEAAEoAMAIAAEsAIAMAAABJACABAABKADACAABLACAIAwAA9gUAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB2wIBAAAAAYEDAQAAAAEBJgAAnwIAIAfIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAdsCAQAAAAGBAwEAAAABASYAAKECADABJgAAoQIAMAgDAAD1BQAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIdsCAQCHBQAhgQMBAI8FACECAAAASwAgJgAApAIAIAfIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh2wIBAIcFACGBAwEAjwUAIQIAAABJACAmAACmAgAgAgAAAEkAICYAAKYCACADAAAASwAgLQAAnwIAIC4AAKQCACABAAAASwAgAQAAAEkAIAQFAADyBQAgMwAA9AUAIDQAAPMFACCBAwAAiwUAIArFAgAArQQAMMYCAACtAgAQxwIAAK0EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdkCAQD4AwAh2wIBAPgDACGBAwEAgAQAIQMAAABJACABAACsAgAwMgAArQIAIAMAAABJACABAABKADACAABLACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAoEAADvBQAgDAAA7gUAIA0AAPAFACAOAADxBQAgyAIBAAAAAcsCQAAAAAHcAgEAAAAB4QIAAACBAwL-AgEAAAAB_wIBAAAAAQEmAAC1AgAgBsgCAQAAAAHLAkAAAAAB3AIBAAAAAeECAAAAgQMC_gIBAAAAAf8CAQAAAAEBJgAAtwIAMAEmAAC3AgAwCgQAAN8FACAMAADeBQAgDQAA4AUAIA4AAOEFACDIAgEAhwUAIcsCQACIBQAh3AIBAIcFACHhAgAA3QWBAyL-AgEAhwUAIf8CAQCHBQAhAgAAABEAICYAALoCACAGyAIBAIcFACHLAkAAiAUAIdwCAQCHBQAh4QIAAN0FgQMi_gIBAIcFACH_AgEAhwUAIQIAAAAPACAmAAC8AgAgAgAAAA8AICYAALwCACADAAAAEQAgLQAAtQIAIC4AALoCACABAAAAEQAgAQAAAA8AIAMFAADaBQAgMwAA3AUAIDQAANsFACAJxQIAAKkEADDGAgAAwwIAEMcCAACpBAAwyAIBAPgDACHLAkAA-QMAIdwCAQD4AwAh4QIAAKoEgQMi_gIBAPgDACH_AgEA-AMAIQMAAAAPACABAADCAgAwMgAAwwIAIAMAAAAPACABAAAQADACAAARACABAAAAOQAgAQAAADkAIAMAAAA3ACABAAA4ADACAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADcAIAEAADgAMAIAADkAIAYDAADZBQAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2wIBAAAAAf0CAQAAAAEBJgAAywIAIAXIAgEAAAABywJAAAAAAcwCQAAAAAHbAgEAAAAB_QIBAAAAAQEmAADNAgAwASYAAM0CADAGAwAA2AUAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdsCAQCHBQAh_QIBAIcFACECAAAAOQAgJgAA0AIAIAXIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHbAgEAhwUAIf0CAQCHBQAhAgAAADcAICYAANICACACAAAANwAgJgAA0gIAIAMAAAA5ACAtAADLAgAgLgAA0AIAIAEAAAA5ACABAAAANwAgAwUAANUFACAzAADXBQAgNAAA1gUAIAjFAgAAqAQAMMYCAADZAgAQxwIAAKgEADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHbAgEA-AMAIf0CAQD4AwAhAwAAADcAIAEAANgCADAyAADZAgAgAwAAADcAIAEAADgAMAIAADkAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgCQMAANMFACALAADUBQAgyAIBAAAAAcsCQAAAAAHbAgEAAAAB-QIBAAAAAfoCAQAAAAH7AiAAAAAB_AIBAAAAAQEmAADhAgAgB8gCAQAAAAHLAkAAAAAB2wIBAAAAAfkCAQAAAAH6AgEAAAAB-wIgAAAAAfwCAQAAAAEBJgAA4wIAMAEmAADjAgAwAQAAAA8AIAkDAADRBQAgCwAA0gUAIMgCAQCHBQAhywJAAIgFACHbAgEAhwUAIfkCAQCHBQAh-gIBAIcFACH7AiAAsAUAIfwCAQCPBQAhAgAAABUAICYAAOcCACAHyAIBAIcFACHLAkAAiAUAIdsCAQCHBQAh-QIBAIcFACH6AgEAhwUAIfsCIACwBQAh_AIBAI8FACECAAAAEwAgJgAA6QIAIAIAAAATACAmAADpAgAgAQAAAA8AIAMAAAAVACAtAADhAgAgLgAA5wIAIAEAAAAVACABAAAAEwAgBAUAAM4FACAzAADQBQAgNAAAzwUAIPwCAACLBQAgCsUCAACnBAAwxgIAAPECABDHAgAApwQAMMgCAQD4AwAhywJAAPkDACHbAgEA-AMAIfkCAQD4AwAh-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-QMAIeICAQD4AwAh4wIBAPgDACHkAgEA-AMAIeUCAQCABAAh5gIBAPgDACHnAgAAjAQAIOgCIACNBAAh6QJAAI4EACEDAAAAowMAIAEAAK8DADAyAACwAwAgAwAAAKMDACABAACkAwAwAgAAoAMAIAEAAAAbACABAAAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgDAMAAKkFACAEAACqBQAgEAAArAUAIBEAAKsFACDIAgEAAAABywJAAAAAAdsCAQAAAAHcAgEAAAAB3QICAAAAAd4CAQAAAAHfAgEAAAAB4QIAAADhAgIBJgAAuAMAIAjIAgEAAAABywJAAAAAAdsCAQAAAAHcAgEAAAAB3QICAAAAAd4CAQAAAAHfAgEAAAAB4QIAAADhAgIBJgAAugMAMAEmAAC6AwAwAQAAABkAIAwDAACZBQAgBAAAmgUAIBAAAJsFACARAACcBQAgyAIBAIcFACHLAkAAiAUAIdsCAQCHBQAh3AIBAIcFACHdAgIAlwUAId4CAQCHBQAh3wIBAI8FACHhAgAAmAXhAiICAAAAGwAgJgAAvgMAIAjIAgEAhwUAIcsCQACIBQAh2wIBAIcFACHcAgEAhwUAId0CAgCXBQAh3gIBAIcFACHfAgEAjwUAIeECAACYBeECIgIAAAAZACAmAADAAwAgAgAAABkAICYAAMADACABAAAAGQAgAwAAABsAIC0AALgDACAuAAC-AwAgAQAAABsAIAEAAAAZACAGBQAAkgUAIDMAAJUFACA0AACUBQAgRQAAkwUAIEYAAJYFACDfAgAAiwUAIAvFAgAAhAQAMMYCAADIAwAQxwIAAIQEADDIAgEA-AMAIcsCQAD5AwAh2wIBAPgDACHcAgEA-AMAId0CAgCFBAAh3gIBAPgDACHfAgEAgAQAIeECAACGBOECIgMAAAAZACABAADHAwAwMgAAyAMAIAMAAAAZACABAAAaADACAAAbACABAAAAPwAgAQAAAD8AIAMAAAA9ACABAAA-ADACAAA_ACADAAAAPQAgAQAAPgAwAgAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAgDAACRBQAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAAB2wIBAAAAAQEmAADQAwAgB8gCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAEBJgAA0gMAMAEmAADSAwAwCAMAAJAFACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh2gIBAI8FACHbAgEAhwUAIQIAAAA_ACAmAADVAwAgB8gCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHaAgEAjwUAIdsCAQCHBQAhAgAAAD0AICYAANcDACACAAAAPQAgJgAA1wMAIAMAAAA_ACAtAADQAwAgLgAA1QMAIAEAAAA_ACABAAAAPQAgBAUAAIwFACAzAACOBQAgNAAAjQUAINoCAACLBQAgCsUCAAD_AwAwxgIAAN4DABDHAgAA_wMAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIdgCAQD4AwAh2QIBAPgDACHaAgEAgAQAIdsCAQD4AwAhAwAAAD0AIAEAAN0DADAyAADeAwAgAwAAAD0AIAEAAD4AMAIAAD8AIAEAAAAqACABAAAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgBwQAAIoFACAGAQAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAHLAkAAAAABzAJAAAAAAQEmAADmAwAgBgYBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCQAAAAAHMAkAAAAABASYAAOgDADABJgAA6AMAMAcEAACJBQAgBgEAhwUAIcgCAQCHBQAhyQIBAIcFACHKAgEAhwUAIcsCQACIBQAhzAJAAIgFACECAAAAKgAgJgAA6wMAIAYGAQCHBQAhyAIBAIcFACHJAgEAhwUAIcoCAQCHBQAhywJAAIgFACHMAkAAiAUAIQIAAAAoACAmAADtAwAgAgAAACgAICYAAO0DACADAAAAKgAgLQAA5gMAIC4AAOsDACABAAAAKgAgAQAAACgAIAMFAACEBQAgMwAAhgUAIDQAAIUFACAJBgEA-AMAIcUCAAD3AwAwxgIAAPQDABDHAgAA9wMAMMgCAQD4AwAhyQIBAPgDACHKAgEA-AMAIcsCQAD5AwAhzAJAAPkDACEDAAAAKAAgAQAA8wMAMDIAAPQDACADAAAAKAAgAQAAKQAwAgAAKgAgCQYBAPgDACHFAgAA9wMAMMYCAAD0AwAQxwIAAPcDADDIAgEA-AMAIckCAQD4AwAhygIBAPgDACHLAkAA-QMAIcwCQAD5AwAhDgUAAPsDACAzAAD-AwAgNAAA_gMAIM0CAQAAAAHOAgEAAAAEzwIBAAAABNACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEA_QMAIdUCAQAAAAHWAgEAAAAB1wIBAAAAAQsFAAD7AwAgMwAA_AMAIDQAAPwDACDNAkAAAAABzgJAAAAABM8CQAAAAATQAkAAAAAB0QJAAAAAAdICQAAAAAHTAkAAAAAB1AJAAPoDACELBQAA-wMAIDMAAPwDACA0AAD8AwAgzQJAAAAAAc4CQAAAAATPAkAAAAAE0AJAAAAAAdECQAAAAAHSAkAAAAAB0wJAAAAAAdQCQAD6AwAhCM0CAgAAAAHOAgIAAAAEzwICAAAABNACAgAAAAHRAgIAAAAB0gICAAAAAdMCAgAAAAHUAgIA-wMAIQjNAkAAAAABzgJAAAAABM8CQAAAAATQAkAAAAAB0QJAAAAAAdICQAAAAAHTAkAAAAAB1AJAAPwDACEOBQAA-wMAIDMAAP4DACA0AAD-AwAgzQIBAAAAAc4CAQAAAATPAgEAAAAE0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQD9AwAh1QIBAAAAAdYCAQAAAAHXAgEAAAABC80CAQAAAAHOAgEAAAAEzwIBAAAABNACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEA_gMAIdUCAQAAAAHWAgEAAAAB1wIBAAAAAQrFAgAA_wMAMMYCAADeAwAQxwIAAP8DADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdkCAQD4AwAh2gIBAIAEACHbAgEA-AMAIQ4FAACCBAAgMwAAgwQAIDQAAIMEACDNAgEAAAABzgIBAAAABc8CAQAAAAXQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAIEEACHVAgEAAAAB1gIBAAAAAdcCAQAAAAEOBQAAggQAIDMAAIMEACA0AACDBAAgzQIBAAAAAc4CAQAAAAXPAgEAAAAF0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQCBBAAh1QIBAAAAAdYCAQAAAAHXAgEAAAABCM0CAgAAAAHOAgIAAAAFzwICAAAABdACAgAAAAHRAgIAAAAB0gICAAAAAdMCAgAAAAHUAgIAggQAIQvNAgEAAAABzgIBAAAABc8CAQAAAAXQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAIMEACHVAgEAAAAB1gIBAAAAAdcCAQAAAAELxQIAAIQEADDGAgAAyAMAEMcCAACEBAAwyAIBAPgDACHLAkAA-QMAIdsCAQD4AwAh3AIBAPgDACHdAgIAhQQAId4CAQD4AwAh3wIBAIAEACHhAgAAhgThAiINBQAA-wMAIDMAAPsDACA0AAD7AwAgRQAAigQAIEYAAPsDACDNAgIAAAABzgICAAAABM8CAgAAAATQAgIAAAAB0QICAAAAAdICAgAAAAHTAgIAAAAB1AICAIkEACEHBQAA-wMAIDMAAIgEACA0AACIBAAgzQIAAADhAgLOAgAAAOECCM8CAAAA4QII1AIAAIcE4QIiBwUAAPsDACAzAACIBAAgNAAAiAQAIM0CAAAA4QICzgIAAADhAgjPAgAAAOECCNQCAACHBOECIgTNAgAAAOECAs4CAAAA4QIIzwIAAADhAgjUAgAAiAThAiINBQAA-wMAIDMAAPsDACA0AAD7AwAgRQAAigQAIEYAAPsDACDNAgIAAAABzgICAAAABM8CAgAAAATQAgIAAAAB0QICAAAAAdICAgAAAAHTAgIAAAAB1AICAIkEACEIzQIIAAAAAc4CCAAAAATPAggAAAAE0AIIAAAAAdECCAAAAAHSAggAAAAB0wIIAAAAAdQCCACKBAAhDsUCAACLBAAwxgIAALADABDHAgAAiwQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIeICAQD4AwAh4wIBAPgDACHkAgEA-AMAIeUCAQCABAAh5gIBAPgDACHnAgAAjAQAIOgCIACNBAAh6QJAAI4EACEPBQAAggQAIDMAAJMEACA0AACTBAAgzQKAAAAAAdACgAAAAAHRAoAAAAAB0gKAAAAAAdMCgAAAAAHUAoAAAAAB6gIBAAAAAesCAQAAAAHsAgEAAAAB7QKAAAAAAe4CgAAAAAHvAoAAAAABBQUAAPsDACAzAACSBAAgNAAAkgQAIM0CIAAAAAHUAiAAkQQAIQsFAACCBAAgMwAAkAQAIDQAAJAEACDNAkAAAAABzgJAAAAABc8CQAAAAAXQAkAAAAAB0QJAAAAAAdICQAAAAAHTAkAAAAAB1AJAAI8EACELBQAAggQAIDMAAJAEACA0AACQBAAgzQJAAAAAAc4CQAAAAAXPAkAAAAAF0AJAAAAAAdECQAAAAAHSAkAAAAAB0wJAAAAAAdQCQACPBAAhCM0CQAAAAAHOAkAAAAAFzwJAAAAABdACQAAAAAHRAkAAAAAB0gJAAAAAAdMCQAAAAAHUAkAAkAQAIQUFAAD7AwAgMwAAkgQAIDQAAJIEACDNAiAAAAAB1AIgAJEEACECzQIgAAAAAdQCIACSBAAhDM0CgAAAAAHQAoAAAAAB0QKAAAAAAdICgAAAAAHTAoAAAAAB1AKAAAAAAeoCAQAAAAHrAgEAAAAB7AIBAAAAAe0CgAAAAAHuAoAAAAAB7wKAAAAAAQ7FAgAAlAQAMMYCAACjAwAQxwIAAJQEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHiAgEAlQQAIeMCAQCVBAAh5AIBAJUEACHlAgEAlgQAIeYCAQCVBAAh5wIAAJcEACDoAiAAmAQAIekCQACZBAAhC80CAQAAAAHOAgEAAAAEzwIBAAAABNACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEA_gMAIdUCAQAAAAHWAgEAAAAB1wIBAAAAAQvNAgEAAAABzgIBAAAABc8CAQAAAAXQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAIMEACHVAgEAAAAB1gIBAAAAAdcCAQAAAAEMzQKAAAAAAdACgAAAAAHRAoAAAAAB0gKAAAAAAdMCgAAAAAHUAoAAAAAB6gIBAAAAAesCAQAAAAHsAgEAAAAB7QKAAAAAAe4CgAAAAAHvAoAAAAABAs0CIAAAAAHUAiAAkgQAIQjNAkAAAAABzgJAAAAABc8CQAAAAAXQAkAAAAAB0QJAAAAAAdICQAAAAAHTAkAAAAAB1AJAAJAEACEIzQJAAAAAAc4CQAAAAATPAkAAAAAE0AJAAAAAAdECQAAAAAHSAkAAAAAB0wJAAAAAAdQCQAD8AwAhDcUCAACbBAAwxgIAAJ0DABDHAgAAmwQAMMgCAQD4AwAhywJAAPkDACHbAgEA-AMAIdwCAQD4AwAh4QIAAJ4E9QIi8AIBAIAEACHxAgEAnAQAIfICAACMBAAg8wIIAJ0EACH1AgEA-AMAIQsFAACCBAAgMwAAgwQAIDQAAIMEACDNAgEAAAABzgIBAAAABc8CAQAAAAXQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAKIEACENBQAA-wMAIDMAAIoEACA0AACKBAAgRQAAigQAIEYAAIoEACDNAggAAAABzgIIAAAABM8CCAAAAATQAggAAAAB0QIIAAAAAdICCAAAAAHTAggAAAAB1AIIAKEEACEHBQAA-wMAIDMAAKAEACA0AACgBAAgzQIAAAD1AgLOAgAAAPUCCM8CAAAA9QII1AIAAJ8E9QIiBwUAAPsDACAzAACgBAAgNAAAoAQAIM0CAAAA9QICzgIAAAD1AgjPAgAAAPUCCNQCAACfBPUCIgTNAgAAAPUCAs4CAAAA9QIIzwIAAAD1AgjUAgAAoAT1AiINBQAA-wMAIDMAAIoEACA0AACKBAAgRQAAigQAIEYAAIoEACDNAggAAAABzgIIAAAABM8CCAAAAATQAggAAAAB0QIIAAAAAdICCAAAAAHTAggAAAAB1AIIAKEEACELBQAAggQAIDMAAIMEACA0AACDBAAgzQIBAAAAAc4CAQAAAAXPAgEAAAAF0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQCiBAAhCcUCAACjBAAwxgIAAIcDABDHAgAAowQAMMgCAQD4AwAh2wIBAPgDACHcAgEA-AMAIeECAACkBPcCIvcCAACeBPUCIvgCQAD5AwAhBwUAAPsDACAzAACmBAAgNAAApgQAIM0CAAAA9wICzgIAAAD3AgjPAgAAAPcCCNQCAAClBPcCIgcFAAD7AwAgMwAApgQAIDQAAKYEACDNAgAAAPcCAs4CAAAA9wIIzwIAAAD3AgjUAgAApQT3AiIEzQIAAAD3AgLOAgAAAPcCCM8CAAAA9wII1AIAAKYE9wIiCsUCAACnBAAwxgIAAPECABDHAgAApwQAMMgCAQD4AwAhywJAAPkDACHbAgEA-AMAIfkCAQD4AwAh-gIBAPgDACH7AiAAjQQAIfwCAQCABAAhCMUCAACoBAAwxgIAANkCABDHAgAAqAQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIdsCAQD4AwAh_QIBAPgDACEJxQIAAKkEADDGAgAAwwIAEMcCAACpBAAwyAIBAPgDACHLAkAA-QMAIdwCAQD4AwAh4QIAAKoEgQMi_gIBAPgDACH_AgEA-AMAIQcFAAD7AwAgMwAArAQAIDQAAKwEACDNAgAAAIEDAs4CAAAAgQMIzwIAAACBAwjUAgAAqwSBAyIHBQAA-wMAIDMAAKwEACA0AACsBAAgzQIAAACBAwLOAgAAAIEDCM8CAAAAgQMI1AIAAKsEgQMiBM0CAAAAgQMCzgIAAACBAwjPAgAAAIEDCNQCAACsBIEDIgrFAgAArQQAMMYCAACtAgAQxwIAAK0EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdkCAQD4AwAh2wIBAPgDACGBAwEAgAQAIRPFAgAArgQAMMYCAACXAgAQxwIAAK4EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdkCAQD4AwAh4QIAALIEiwMiggNAAPkDACGDAwEA-AMAIYQDAQD4AwAhhQMAAK8EACCHAwAAsASHAyKJAwAAsQSJAyKLAyAAswQAIYwDAQD4AwAhjQMIAJ0EACGOAwEA-AMAIQTNAgEAAAAFjwMBAAAAAZADAQAAAASRAwEAAAAEBwUAAPsDACAzAAC7BAAgNAAAuwQAIM0CAAAAhwMCzgIAAACHAwjPAgAAAIcDCNQCAAC6BIcDIgcFAAD7AwAgMwAAuQQAIDQAALkEACDNAgAAAIkDAs4CAAAAiQMIzwIAAACJAwjUAgAAuASJAyIHBQAA-wMAIDMAALcEACA0AAC3BAAgzQIAAACLAwLOAgAAAIsDCM8CAAAAiwMI1AIAALYEiwMiBQUAAIIEACAzAAC1BAAgNAAAtQQAIM0CIAAAAAHUAiAAtAQAIQUFAACCBAAgMwAAtQQAIDQAALUEACDNAiAAAAAB1AIgALQEACECzQIgAAAAAdQCIAC1BAAhBwUAAPsDACAzAAC3BAAgNAAAtwQAIM0CAAAAiwMCzgIAAACLAwjPAgAAAIsDCNQCAAC2BIsDIgTNAgAAAIsDAs4CAAAAiwMIzwIAAACLAwjUAgAAtwSLAyIHBQAA-wMAIDMAALkEACA0AAC5BAAgzQIAAACJAwLOAgAAAIkDCM8CAAAAiQMI1AIAALgEiQMiBM0CAAAAiQMCzgIAAACJAwjPAgAAAIkDCNQCAAC5BIkDIgcFAAD7AwAgMwAAuwQAIDQAALsEACDNAgAAAIcDAs4CAAAAhwMIzwIAAACHAwjUAgAAugSHAyIEzQIAAACHAwLOAgAAAIcDCM8CAAAAhwMI1AIAALsEhwMiCcUCAAC8BAAwxgIAAIECABDHAgAAvAQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIYEDAQD4AwAhkgMBAPgDACGTAwEA-AMAIQvFAgAAvQQAMMYCAADrAQAQxwIAAL0EADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHYAgEA-AMAIdwCAQD4AwAh5gIBAPgDACGFAwAArwQAIJQDAQD4AwAhCcUCAAC-BAAwxgIAANMBABDHAgAAvgQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIZUDAQD4AwAhlgMBAPgDACGXA0AA-QMAIQnFAgAAvwQAMMYCAADAAQAQxwIAAL8EADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACGVAwEAlQQAIZYDAQCVBAAhlwNAAJoEACEQxQIAAMAEADDGAgAAugEAEMcCAADABAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAh2wIBAPgDACGYAwEA-AMAIZkDAQD4AwAhmgMBAIAEACGbAwEAgAQAIZwDAQCABAAhnQNAAI4EACGeA0AAjgQAIZ8DAQCABAAhoAMBAIAEACELxQIAAMEEADDGAgAApAEAEMcCAADBBAAwyAIBAPgDACHLAkAA-QMAIcwCQAD5AwAh2wIBAPgDACGXA0AA-QMAIaEDAQD4AwAhogMBAIAEACGjAwEAgAQAIRTFAgAAwgQAMMYCAACOAQAQxwIAAMIEADDIAgEA-AMAIcsCQAD5AwAhzAJAAPkDACHhAgAAxASnAyLoAiAAjQQAIekCQACOBAAh_QIBAPgDACGBAwEA-AMAIZMDAQD4AwAhpQMAAMMEpQMipwMBAIAEACGoAwEAgAQAIakDIACNBAAhqgMgAI0EACGsAwAAxQSsAyKtAwIAhQQAIa4DQACOBAAhBwUAAPsDACAzAADLBAAgNAAAywQAIM0CAAAApQMCzgIAAAClAwjPAgAAAKUDCNQCAADKBKUDIgcFAAD7AwAgMwAAyQQAIDQAAMkEACDNAgAAAKcDAs4CAAAApwMIzwIAAACnAwjUAgAAyASnAyIHBQAA-wMAIDMAAMcEACA0AADHBAAgzQIAAACsAwLOAgAAAKwDCM8CAAAArAMI1AIAAMYErAMiBwUAAPsDACAzAADHBAAgNAAAxwQAIM0CAAAArAMCzgIAAACsAwjPAgAAAKwDCNQCAADGBKwDIgTNAgAAAKwDAs4CAAAArAMIzwIAAACsAwjUAgAAxwSsAyIHBQAA-wMAIDMAAMkEACA0AADJBAAgzQIAAACnAwLOAgAAAKcDCM8CAAAApwMI1AIAAMgEpwMiBM0CAAAApwMCzgIAAACnAwjPAgAAAKcDCNQCAADJBKcDIgcFAAD7AwAgMwAAywQAIDQAAMsEACDNAgAAAKUDAs4CAAAApQMIzwIAAAClAwjUAgAAygSlAyIEzQIAAAClAwLOAgAAAKUDCM8CAAAApQMI1AIAAMsEpQMiIwoAANIEACAMAADWBAAgEgAA0wQAIBMAANQEACAVAADVBAAgFwAA0QQAIBgAANcEACAZAADYBAAgGgAA2AQAIBsAANkEACAcAADaBAAgHQAA2wQAIB4AANwEACAfAADdBAAgIAAA3gQAIMUCAADMBAAwxgIAAHsAEMcCAADMBAAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAh4QIAAM4EpwMi6AIgAJgEACHpAkAAmQQAIf0CAQCVBAAhgQMBAJUEACGTAwEAlQQAIaUDAADNBKUDIqcDAQCWBAAhqAMBAJYEACGpAyAAmAQAIaoDIACYBAAhrAMAAM8ErAMirQMCANAEACGuA0AAmQQAIQTNAgAAAKUDAs4CAAAApQMIzwIAAAClAwjUAgAAywSlAyIEzQIAAACnAwLOAgAAAKcDCM8CAAAApwMI1AIAAMkEpwMiBM0CAAAArAMCzgIAAACsAwjPAgAAAKwDCNQCAADHBKwDIgjNAgIAAAABzgICAAAABM8CAgAAAATQAgIAAAAB0QICAAAAAdICAgAAAAHTAgIAAAAB1AICAPsDACEDrwMAAAMAILADAAADACCxAwAAAwAgA68DAAAJACCwAwAACQAgsQMAAAkAIAOvAwAAGQAgsAMAABkAILEDAAAZACADrwMAAA0AILADAAANACCxAwAADQAgA68DAAAjACCwAwAAIwAgsQMAACMAIAOvAwAAEwAgsAMAABMAILEDAAATACADrwMAADcAILADAAA3ACCxAwAANwAgA68DAAAPACCwAwAADwAgsQMAAA8AIAOvAwAAPQAgsAMAAD0AILEDAAA9ACADrwMAAEEAILADAABBACCxAwAAQQAgA68DAABFACCwAwAARQAgsQMAAEUAIAOvAwAASQAgsAMAAEkAILEDAABJACADrwMAAE0AILADAABNACCxAwAATQAgA68DAABRACCwAwAAUQAgsQMAAFEAIAnFAgAA3wQAMMYCAAB1ABDHAgAA3wQAMMgCAQD4AwAhywJAAPkDACHMAkAA-QMAIdsCAQD4AwAhsgMBAPgDACGzAwEA-AMAIQoDAADhBAAgxQIAAOAEADDGAgAAUQAQxwIAAOAEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHbAgEAlQQAIbIDAQCVBAAhswMBAJUEACElCgAA0gQAIAwAANYEACASAADTBAAgEwAA1AQAIBUAANUEACAXAADRBAAgGAAA1wQAIBkAANgEACAaAADYBAAgGwAA2QQAIBwAANoEACAdAADbBAAgHgAA3AQAIB8AAN0EACAgAADeBAAgxQIAAMwEADDGAgAAewAQxwIAAMwEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHhAgAAzgSnAyLoAiAAmAQAIekCQACZBAAh_QIBAJUEACGBAwEAlQQAIZMDAQCVBAAhpQMAAM0EpQMipwMBAJYEACGoAwEAlgQAIakDIACYBAAhqgMgAJgEACGsAwAAzwSsAyKtAwIA0AQAIa4DQACZBAAhtQMAAHsAILYDAAB7ACALAwAA4QQAIAQAANEEACDFAgAA4gQAMMYCAABNABDHAgAA4gQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIYEDAQCVBAAhkgMBAJUEACGTAwEAlQQAIQsDAADhBAAgxQIAAOMEADDGAgAASQAQxwIAAOMEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHYAgEAlQQAIdkCAQCVBAAh2wIBAJUEACGBAwEAlgQAIREDAADhBAAgxQIAAOQEADDGAgAARQAQxwIAAOQEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHbAgEAlQQAIZgDAQCVBAAhmQMBAJUEACGaAwEAlgQAIZsDAQCWBAAhnAMBAJYEACGdA0AAmQQAIZ4DQACZBAAhnwMBAJYEACGgAwEAlgQAIQwDAADhBAAgxQIAAOUEADDGAgAAQQAQxwIAAOUEADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHbAgEAlQQAIZcDQACaBAAhoQMBAJUEACGiAwEAlgQAIaMDAQCWBAAhCwMAAOEEACDFAgAA5gQAMMYCAAA9ABDHAgAA5gQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHaAgEAlgQAIdsCAQCVBAAhCQMAAOEEACDFAgAA5wQAMMYCAAA3ABDHAgAA5wQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdsCAQCVBAAh_QIBAJUEACEDBgEAAAAByQIBAAAAAcoCAQAAAAEKBAAA6gQAIAYBAJUEACHFAgAA6QQAMMYCAAAoABDHAgAA6QQAMMgCAQCVBAAhyQIBAJUEACHKAgEAlQQAIcsCQACaBAAhzAJAAJoEACEdBgAAggUAIAcAAOEEACAKAADSBAAgDwAA2AQAIBIAANMEACATAADUBAAgFQAA1QQAIBYAAIMFACDFAgAA_QQAMMYCAAADABDHAgAA_QQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHhAgAAgAWLAyKCA0AAmgQAIYMDAQCVBAAhhAMBAJUEACGFAwAArwQAIIcDAAD-BIcDIokDAAD_BIkDIosDIACBBQAhjAMBAJUEACGNAwgA7gQAIY4DAQCVBAAhtQMAAAMAILYDAAADACANBAAA7AQAIBQAAOEEACDFAgAA6wQAMMYCAAAjABDHAgAA6wQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh3AIBAJUEACHmAgEAlQQAIYUDAACvBAAglAMBAJUEACEdBgAAggUAIAcAAOEEACAKAADSBAAgDwAA2AQAIBIAANMEACATAADUBAAgFQAA1QQAIBYAAIMFACDFAgAA_QQAMMYCAAADABDHAgAA_QQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHhAgAAgAWLAyKCA0AAmgQAIYMDAQCVBAAhhAMBAJUEACGFAwAArwQAIIcDAAD-BIcDIokDAAD_BIkDIosDIACBBQAhjAMBAJUEACGNAwgA7gQAIY4DAQCVBAAhtQMAAAMAILYDAAADACAQAwAA4QQAIAQAAOoEACAIAADwBAAgxQIAAO0EADDGAgAADQAQxwIAAO0EADDIAgEAlQQAIcsCQACaBAAh2wIBAJUEACHcAgEAlQQAIeECAADvBPUCIvACAQCWBAAh8QIBAPgEACHyAgAAlwQAIPMCCADuBAAh9QIBAJUEACEIzQIIAAAAAc4CCAAAAATPAggAAAAE0AIIAAAAAdECCAAAAAHSAggAAAAB0wIIAAAAAdQCCACKBAAhBM0CAAAA9QICzgIAAAD1AgjPAgAAAPUCCNQCAACgBPUCIg4DAADhBAAgBAAA6gQAIAkAAPwEACDFAgAA-gQAMMYCAAAJABDHAgAA-gQAMMgCAQCVBAAh2wIBAJUEACHcAgEAlQQAIeECAAD7BPcCIvcCAADvBPUCIvgCQACaBAAhtQMAAAkAILYDAAAJACAPAwAA4QQAIAQAAOoEACAQAADzBAAgEQAA0wQAIMUCAADxBAAwxgIAABkAEMcCAADxBAAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh3AIBAJUEACHdAgIA0AQAId4CAQCVBAAh3wIBAJYEACHhAgAA8gThAiIEzQIAAADhAgLOAgAAAOECCM8CAAAA4QII1AIAAIgE4QIiEQMAAOEEACAEAADqBAAgEAAA8wQAIBEAANMEACDFAgAA8QQAMMYCAAAZABDHAgAA8QQAMMgCAQCVBAAhywJAAJoEACHbAgEAlQQAIdwCAQCVBAAh3QICANAEACHeAgEAlQQAId8CAQCWBAAh4QIAAPIE4QIitQMAABkAILYDAAAZACAMAwAA4QQAIAsAAPUEACDFAgAA9AQAMMYCAAATABDHAgAA9AQAMMgCAQCVBAAhywJAAJoEACHbAgEAlQQAIfkCAQCVBAAh-gIBAJUEACH7AiAAmAQAIfwCAQCWBAAhDwQAAOoEACAMAADWBAAgDQAA4QQAIA4AAOEEACDFAgAA9gQAMMYCAAAPABDHAgAA9gQAMMgCAQCVBAAhywJAAJoEACHcAgEAlQQAIeECAAD3BIEDIv4CAQCVBAAh_wIBAJUEACG1AwAADwAgtgMAAA8AIA0EAADqBAAgDAAA1gQAIA0AAOEEACAOAADhBAAgxQIAAPYEADDGAgAADwAQxwIAAPYEADDIAgEAlQQAIcsCQACaBAAh3AIBAJUEACHhAgAA9wSBAyL-AgEAlQQAIf8CAQCVBAAhBM0CAAAAgQMCzgIAAACBAwjPAgAAAIEDCNQCAACsBIEDIgjNAgEAAAABzgIBAAAABc8CAQAAAAXQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAPkEACEIzQIBAAAAAc4CAQAAAAXPAgEAAAAF0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQD5BAAhDAMAAOEEACAEAADqBAAgCQAA_AQAIMUCAAD6BAAwxgIAAAkAEMcCAAD6BAAwyAIBAJUEACHbAgEAlQQAIdwCAQCVBAAh4QIAAPsE9wIi9wIAAO8E9QIi-AJAAJoEACEEzQIAAAD3AgLOAgAAAPcCCM8CAAAA9wII1AIAAKYE9wIiEgMAAOEEACAEAADqBAAgCAAA8AQAIMUCAADtBAAwxgIAAA0AEMcCAADtBAAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh3AIBAJUEACHhAgAA7wT1AiLwAgEAlgQAIfECAQD4BAAh8gIAAJcEACDzAggA7gQAIfUCAQCVBAAhtQMAAA0AILYDAAANACAbBgAAggUAIAcAAOEEACAKAADSBAAgDwAA2AQAIBIAANMEACATAADUBAAgFQAA1QQAIBYAAIMFACDFAgAA_QQAMMYCAAADABDHAgAA_QQAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHhAgAAgAWLAyKCA0AAmgQAIYMDAQCVBAAhhAMBAJUEACGFAwAArwQAIIcDAAD-BIcDIokDAAD_BIkDIosDIACBBQAhjAMBAJUEACGNAwgA7gQAIY4DAQCVBAAhBM0CAAAAhwMCzgIAAACHAwjPAgAAAIcDCNQCAAC7BIcDIgTNAgAAAIkDAs4CAAAAiQMIzwIAAACJAwjUAgAAuQSJAyIEzQIAAACLAwLOAgAAAIsDCM8CAAAAiwMI1AIAALcEiwMiAs0CIAAAAAHUAiAAtQQAIQ0DAADhBAAgBAAA0QQAIMUCAADiBAAwxgIAAE0AEMcCAADiBAAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAhgQMBAJUEACGSAwEAlQQAIZMDAQCVBAAhtQMAAE0AILYDAABNACADrwMAACgAILADAAAoACCxAwAAKAAgAAAAAboDAQAAAAEBugNAAAAAAQUtAADtCQAgLgAA8AkAILcDAADuCQAguAMAAO8JACC9AwAABQAgAy0AAO0JACC3AwAA7gkAIL0DAAAFACAAAAAAAboDAQAAAAEFLQAA6AkAIC4AAOsJACC3AwAA6QkAILgDAADqCQAgvQMAAHgAIAMtAADoCQAgtwMAAOkJACC9AwAAeAAgAAAAAAAFugMCAAAAAcEDAgAAAAHCAwIAAAABwwMCAAAAAcQDAgAAAAEBugMAAADhAgIFLQAA3AkAIC4AAOYJACC3AwAA3QkAILgDAADlCQAgvQMAAHgAIAUtAADaCQAgLgAA4wkAILcDAADbCQAguAMAAOIJACC9AwAABQAgBy0AANgJACAuAADgCQAgtwMAANkJACC4AwAA3wkAILsDAAAZACC8AwAAGQAgvQMAABsAIAstAACdBQAwLgAAogUAMLcDAACeBQAwuAMAAJ8FADC5AwAAoAUAILoDAAChBQAwuwMAAKEFADC8AwAAoQUAML0DAAChBQAwvgMAAKMFADC_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-QIBAJUEACH6AgEAlQQAIfsCIACYBAAh_AIBAJYEACEKxQIAAOkFADDGAgAA6gUAEMcCAADpBQAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh-QIBAJUEACH6AgEAlQQAIfsCIACYBAAh_AIBAJYEACEGyAIBAIcFACHLAkAAiAUAIdsCAQCHBQAh-QIBAIcFACH6AgEAhwUAIfsCIACwBQAhBwMAANEFACDIAgEAhwUAIcsCQACIBQAh2wIBAIcFACH5AgEAhwUAIfoCAQCHBQAh-wIgALAFACEHAwAA0wUAIMgCAQAAAAHLAkAAAAAB2wIBAAAAAfkCAQAAAAH6AgEAAAAB-wIgAAAAAQQtAADiBQAwtwMAAOMFADC5AwAA5QUAIL0DAADmBQAwAy0AAKQJACC3AwAApQkAIL0DAAAFACADLQAAogkAILcDAACjCQAgvQMAAHgAIAMtAACgCQAgtwMAAKEJACC9AwAAeAAgAAAABS0AAJsJACAuAACeCQAgtwMAAJwJACC4AwAAnQkAIL0DAAB4ACADLQAAmwkAILcDAACcCQAgvQMAAHgAIAAAAAAAAroDAQAAAATAAwEAAAAFAboDAAAAhwMCAboDAAAAiQMCAboDAAAAiwMCAboDIAAAAAEFLQAAiAkAIC4AAJkJACC3AwAAiQkAILgDAACYCQAgvQMAAE8AIAUtAACGCQAgLgAAlgkAILcDAACHCQAguAMAAJUJACC9AwAAeAAgCy0AAMYGADAuAADLBgAwtwMAAMcGADC4AwAAyAYAMLkDAADJBgAgugMAAMoGADC7AwAAygYAMLwDAADKBgAwvQMAAMoGADC-AwAAzAYAML8DAADNBgAwCy0AALoGADAuAAC_BgAwtwMAALsGADC4AwAAvAYAMLkDAAC9BgAgugMAAL4GADC7AwAAvgYAMLwDAAC-BgAwvQMAAL4GADC-AwAAwAYAML8DAADBBgAwCy0AALEGADAuAAC1BgAwtwMAALIGADC4AwAAswYAMLkDAAC0BgAgugMAAKEFADC7AwAAoQUAMLwDAAChBQAwvQMAAKEFADC-AwAAtgYAML8DAACkBQAwCy0AAKUGADAuAACqBgAwtwMAAKYGADC4AwAApwYAMLkDAACoBgAgugMAAKkGADC7AwAAqQYAMLwDAACpBgAwvQMAAKkGADC-AwAAqwYAML8DAACsBgAwCy0AAJUGADAuAACaBgAwtwMAAJYGADC4AwAAlwYAMLkDAACYBgAgugMAAJkGADC7AwAAmQYAMLwDAACZBgAwvQMAAJkGADC-AwAAmwYAML8DAACcBgAwCy0AAIkGADAuAACOBgAwtwMAAIoGADC4AwAAiwYAMLkDAACMBgAgugMAAI0GADC7AwAAjQYAMLwDAACNBgAwvQMAAI0GADC-AwAAjwYAML8DAACQBgAwBQYBAAAAAcgCAQAAAAHJAgEAAAABywJAAAAAAcwCQAAAAAECAAAAKgAgLQAAlAYAIAMAAAAqACAtAACUBgAgLgAAkwYAIAEmAACUCQAwCwQAAOoEACAGAQCVBAAhxQIAAOkEADDGAgAAKAAQxwIAAOkEADDIAgEAAAAByQIBAJUEACHKAgEAlQQAIcsCQACaBAAhzAJAAJoEACG0AwAA6AQAIAIAAAAqACAmAACTBgAgAgAAAJEGACAmAACSBgAgCQYBAJUEACHFAgAAkAYAMMYCAACRBgAQxwIAAJAGADDIAgEAlQQAIckCAQCVBAAhygIBAJUEACHLAkAAmgQAIcwCQACaBAAhCQYBAJUEACHFAgAAkAYAMMYCAACRBgAQxwIAAJAGADDIAgEAlQQAIckCAQCVBAAhygIBAJUEACHLAkAAmgQAIcwCQACaBAAhBQYBAIcFACHIAgEAhwUAIckCAQCHBQAhywJAAIgFACHMAkAAiAUAIQUGAQCHBQAhyAIBAIcFACHJAgEAhwUAIcsCQACIBQAhzAJAAIgFACEFBgEAAAAByAIBAAAAAckCAQAAAAHLAkAAAAABzAJAAAAAAQgUAACkBgAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAeYCAQAAAAGFAwAAowYAIJQDAQAAAAECAAAAJQAgLQAAogYAIAMAAAAlACAtAACiBgAgLgAAoAYAIAEmAACTCQAwDQQAAOwEACAUAADhBAAgxQIAAOsEADDGAgAAIwAQxwIAAOsEADDIAgEAAAABywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh3AIBAJUEACHmAgEAlQQAIYUDAACvBAAglAMBAJUEACECAAAAJQAgJgAAoAYAIAIAAACdBgAgJgAAngYAIAvFAgAAnAYAMMYCAACdBgAQxwIAAJwGADDIAgEAlQQAIcsCQACaBAAhzAJAAJoEACHYAgEAlQQAIdwCAQCVBAAh5gIBAJUEACGFAwAArwQAIJQDAQCVBAAhC8UCAACcBgAwxgIAAJ0GABDHAgAAnAYAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh3AIBAJUEACHmAgEAlQQAIYUDAACvBAAglAMBAJUEACEHyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHmAgEAhwUAIYUDAACfBgAglAMBAIcFACECugMBAAAABMADAQAAAAUIFAAAoQYAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh5gIBAIcFACGFAwAAnwYAIJQDAQCHBQAhBS0AAI4JACAuAACRCQAgtwMAAI8JACC4AwAAkAkAIL0DAAB4ACAIFAAApAYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHmAgEAAAABhQMAAKMGACCUAwEAAAABAboDAQAAAAQDLQAAjgkAILcDAACPCQAgvQMAAHgAIAsDAAC8BQAgCAAAvgUAIMgCAQAAAAHLAkAAAAAB2wIBAAAAAeECAAAA9QIC8AIBAAAAAfECAQAAAAHyAoAAAAAB8wIIAAAAAfUCAQAAAAECAAAAIQAgLQAAsAYAIAMAAAAhACAtAACwBgAgLgAArwYAIAEmAACNCQAwEAMAAOEEACAEAADqBAAgCAAA8AQAIMUCAADtBAAwxgIAAA0AEMcCAADtBAAwyAIBAAAAAcsCQACaBAAh2wIBAJUEACHcAgEAlQQAIeECAADvBPUCIvACAQAAAAHxAgEAAAAB8gIAAJcEACDzAggA7gQAIfUCAQAAAAECAAAAIQAgJgAArwYAIAIAAACtBgAgJgAArgYAIA3FAgAArAYAMMYCAACtBgAQxwIAAKwGADDIAgEAlQQAIcsCQACaBAAh2wIBAJUEACHcAgEAlQQAIeECAADvBPUCIvACAQCWBAAh8QIBAPgEACHyAgAAlwQAIPMCCADuBAAh9QIBAJUEACENxQIAAKwGADDGAgAArQYAEMcCAACsBgAwyAIBAJUEACHLAkAAmgQAIdsCAQCVBAAh3AIBAJUEACHhAgAA7wT1AiLwAgEAlgQAIfECAQD4BAAh8gIAAJcEACDzAggA7gQAIfUCAQCVBAAhCcgCAQCHBQAhywJAAIgFACHbAgEAhwUAIeECAAC4BfUCIvACAQCPBQAh8QIBAI8FACHyAoAAAAAB8wIIALcFACH1AgEAhwUAIQsDAAC5BQAgCAAAuwUAIMgCAQCHBQAhywJAAIgFACHbAgEAhwUAIeECAAC4BfUCIvACAQCPBQAh8QIBAI8FACHyAoAAAAAB8wIIALcFACH1AgEAhwUAIQsDAAC8BQAgCAAAvgUAIMgCAQAAAAHLAkAAAAAB2wIBAAAAAeECAAAA9QIC8AIBAAAAAfECAQAAAAHyAoAAAAAB8wIIAAAAAfUCAQAAAAEKAwAAqQUAIBAAAKwFACARAACrBQAgyAIBAAAAAcsCQAAAAAHbAgEAAAAB3QICAAAAAd4CAQAAAAHfAgEAAAAB4QIAAADhAgICAAAAGwAgLQAAuQYAIAMAAAAbACAtAAC5BgAgLgAAuAYAIAEmAACMCQAwAgAAABsAICYAALgGACACAAAApQUAICYAALcGACAHyAIBAIcFACHLAkAAiAUAIdsCAQCHBQAh3QICAJcFACHeAgEAhwUAId8CAQCPBQAh4QIAAJgF4QIiCgMAAJkFACAQAACbBQAgEQAAnAUAIMgCAQCHBQAhywJAAIgFACHbAgEAhwUAId0CAgCXBQAh3gIBAIcFACHfAgEAjwUAIeECAACYBeECIgoDAACpBQAgEAAArAUAIBEAAKsFACDIAgEAAAABywJAAAAAAdsCAQAAAAHdAgIAAAAB3gIBAAAAAd8CAQAAAAHhAgAAAOECAggMAADuBQAgDQAA8AUAIA4AAPEFACDIAgEAAAABywJAAAAAAeECAAAAgQMC_gIBAAAAAf8CAQAAAAECAAAAEQAgLQAAxQYAIAMAAAARACAtAADFBgAgLgAAxAYAIAEmAACLCQAwDQQAAOoEACAMAADWBAAgDQAA4QQAIA4AAOEEACDFAgAA9gQAMMYCAAAPABDHAgAA9gQAMMgCAQAAAAHLAkAAmgQAIdwCAQCVBAAh4QIAAPcEgQMi_gIBAJUEACH_AgEAlQQAIQIAAAARACAmAADEBgAgAgAAAMIGACAmAADDBgAgCcUCAADBBgAwxgIAAMIGABDHAgAAwQYAMMgCAQCVBAAhywJAAJoEACHcAgEAlQQAIeECAAD3BIEDIv4CAQCVBAAh_wIBAJUEACEJxQIAAMEGADDGAgAAwgYAEMcCAADBBgAwyAIBAJUEACHLAkAAmgQAIdwCAQCVBAAh4QIAAPcEgQMi_gIBAJUEACH_AgEAlQQAIQXIAgEAhwUAIcsCQACIBQAh4QIAAN0FgQMi_gIBAIcFACH_AgEAhwUAIQgMAADeBQAgDQAA4AUAIA4AAOEFACDIAgEAhwUAIcsCQACIBQAh4QIAAN0FgQMi_gIBAIcFACH_AgEAhwUAIQgMAADuBQAgDQAA8AUAIA4AAPEFACDIAgEAAAABywJAAAAAAeECAAAAgQMC_gIBAAAAAf8CAQAAAAEHAwAAywUAIAkAAM0FACDIAgEAAAAB2wIBAAAAAeECAAAA9wIC9wIAAAD1AgL4AkAAAAABAgAAAAsAIC0AANEGACADAAAACwAgLQAA0QYAIC4AANAGACABJgAAigkAMAwDAADhBAAgBAAA6gQAIAkAAPwEACDFAgAA-gQAMMYCAAAJABDHAgAA-gQAMMgCAQAAAAHbAgEAlQQAIdwCAQCVBAAh4QIAAPsE9wIi9wIAAO8E9QIi-AJAAJoEACECAAAACwAgJgAA0AYAIAIAAADOBgAgJgAAzwYAIAnFAgAAzQYAMMYCAADOBgAQxwIAAM0GADDIAgEAlQQAIdsCAQCVBAAh3AIBAJUEACHhAgAA-wT3AiL3AgAA7wT1AiL4AkAAmgQAIQnFAgAAzQYAMMYCAADOBgAQxwIAAM0GADDIAgEAlQQAIdsCAQCVBAAh3AIBAJUEACHhAgAA-wT3AiL3AgAA7wT1AiL4AkAAmgQAIQXIAgEAhwUAIdsCAQCHBQAh4QIAAMIF9wIi9wIAALgF9QIi-AJAAIgFACEHAwAAwwUAIAkAAMUFACDIAgEAhwUAIdsCAQCHBQAh4QIAAMIF9wIi9wIAALgF9QIi-AJAAIgFACEHAwAAywUAIAkAAM0FACDIAgEAAAAB2wIBAAAAAeECAAAA9wIC9wIAAAD1AgL4AkAAAAABAboDAQAAAAQDLQAAiAkAILcDAACJCQAgvQMAAE8AIAMtAACGCQAgtwMAAIcJACC9AwAAeAAgBC0AAMYGADC3AwAAxwYAMLkDAADJBgAgvQMAAMoGADAELQAAugYAMLcDAAC7BgAwuQMAAL0GACC9AwAAvgYAMAQtAACxBgAwtwMAALIGADC5AwAAtAYAIL0DAAChBQAwBC0AAKUGADC3AwAApgYAMLkDAACoBgAgvQMAAKkGADAELQAAlQYAMLcDAACWBgAwuQMAAJgGACC9AwAAmQYAMAQtAACJBgAwtwMAAIoGADC5AwAAjAYAIL0DAACNBgAwAAAABS0AAIAJACAuAACECQAgtwMAAIEJACC4AwAAgwkAIL0DAAB4ACALLQAA4AYAMC4AAOUGADC3AwAA4QYAMLgDAADiBgAwuQMAAOMGACC6AwAA5AYAMLsDAADkBgAwvAMAAOQGADC9AwAA5AYAML4DAADmBgAwvwMAAOcGADAWBwAA1AYAIAoAANUGACAPAADWBgAgEgAA1wYAIBMAANgGACAVAADZBgAgFgAA2gYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjQMIAAAAAY4DAQAAAAECAAAABQAgLQAA6wYAIAMAAAAFACAtAADrBgAgLgAA6gYAIAEmAACCCQAwGwYAAIIFACAHAADhBAAgCgAA0gQAIA8AANgEACASAADTBAAgEwAA1AQAIBUAANUEACAWAACDBQAgxQIAAP0EADDGAgAAAwAQxwIAAP0EADDIAgEAAAABywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHhAgAAgAWLAyKCA0AAmgQAIYMDAQCVBAAhhAMBAJUEACGFAwAArwQAIIcDAAD-BIcDIokDAAD_BIkDIosDIACBBQAhjAMBAJUEACGNAwgA7gQAIY4DAQCVBAAhAgAAAAUAICYAAOoGACACAAAA6AYAICYAAOkGACATxQIAAOcGADDGAgAA6AYAEMcCAADnBgAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAh2AIBAJUEACHZAgEAlQQAIeECAACABYsDIoIDQACaBAAhgwMBAJUEACGEAwEAlQQAIYUDAACvBAAghwMAAP4EhwMiiQMAAP8EiQMiiwMgAIEFACGMAwEAlQQAIY0DCADuBAAhjgMBAJUEACETxQIAAOcGADDGAgAA6AYAEMcCAADnBgAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAh2AIBAJUEACHZAgEAlQQAIeECAACABYsDIoIDQACaBAAhgwMBAJUEACGEAwEAlQQAIYUDAACvBAAghwMAAP4EhwMiiQMAAP8EiQMiiwMgAIEFACGMAwEAlQQAIY0DCADuBAAhjgMBAJUEACEPyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIeECAAD_BYsDIoIDQACIBQAhgwMBAIcFACGEAwEAhwUAIYUDAAD8BQAghwMAAP0FhwMiiQMAAP4FiQMiiwMgAIAGACGNAwgAtwUAIY4DAQCHBQAhFgcAAIIGACAKAACDBgAgDwAAhAYAIBIAAIUGACATAACGBgAgFQAAhwYAIBYAAIgGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIY0DCAC3BQAhjgMBAIcFACEWBwAA1AYAIAoAANUGACAPAADWBgAgEgAA1wYAIBMAANgGACAVAADZBgAgFgAA2gYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjQMIAAAAAY4DAQAAAAEDLQAAgAkAILcDAACBCQAgvQMAAHgAIAQtAADgBgAwtwMAAOEGADC5AwAA4wYAIL0DAADkBgAwAAAABy0AAPsIACAuAAD-CAAgtwMAAPwIACC4AwAA_QgAILsDAAADACC8AwAAAwAgvQMAAAUAIAMtAAD7CAAgtwMAAPwIACC9AwAABQAgAAAAAAAABS0AAPYIACAuAAD5CAAgtwMAAPcIACC4AwAA-AgAIL0DAAB4ACADLQAA9ggAILcDAAD3CAAgvQMAAHgAIAAAAAUtAADxCAAgLgAA9AgAILcDAADyCAAguAMAAPMIACC9AwAAeAAgAy0AAPEIACC3AwAA8ggAIL0DAAB4ACAAAAAAAAG6AwAAAKUDAgG6AwAAAKcDAgG6AwAAAKwDAgstAACqCAAwLgAArggAMLcDAACrCAAwuAMAAKwIADC5AwAArQgAILoDAADkBgAwuwMAAOQGADC8AwAA5AYAML0DAADkBgAwvgMAAK8IADC_AwAA5wYAMAstAAChCAAwLgAApQgAMLcDAACiCAAwuAMAAKMIADC5AwAApAgAILoDAADKBgAwuwMAAMoGADC8AwAAygYAML0DAADKBgAwvgMAAKYIADC_AwAAzQYAMAstAACYCAAwLgAAnAgAMLcDAACZCAAwuAMAAJoIADC5AwAAmwgAILoDAAChBQAwuwMAAKEFADC8AwAAoQUAML0DAAChBQAwvgMAAJ0IADC_AwAApAUAMAstAACPCAAwLgAAkwgAMLcDAACQCAAwuAMAAJEIADC5AwAAkggAILoDAACpBgAwuwMAAKkGADC8AwAAqQYAML0DAACpBgAwvgMAAJQIADC_AwAArAYAMAstAACGCAAwLgAAiggAMLcDAACHCAAwuAMAAIgIADC5AwAAiQgAILoDAACZBgAwuwMAAJkGADC8AwAAmQYAML0DAACZBgAwvgMAAIsIADC_AwAAnAYAMAstAAD9BwAwLgAAgQgAMLcDAAD-BwAwuAMAAP8HADC5AwAAgAgAILoDAADmBQAwuwMAAOYFADC8AwAA5gUAML0DAADmBQAwvgMAAIIIADC_AwAA6QUAMAstAADxBwAwLgAA9gcAMLcDAADyBwAwuAMAAPMHADC5AwAA9AcAILoDAAD1BwAwuwMAAPUHADC8AwAA9QcAML0DAAD1BwAwvgMAAPcHADC_AwAA-AcAMAstAADoBwAwLgAA7AcAMLcDAADpBwAwuAMAAOoHADC5AwAA6wcAILoDAAC-BgAwuwMAAL4GADC8AwAAvgYAML0DAAC-BgAwvgMAAO0HADC_AwAAwQYAMAstAADfBwAwLgAA4wcAMLcDAADgBwAwuAMAAOEHADC5AwAA4gcAILoDAAC-BgAwuwMAAL4GADC8AwAAvgYAML0DAAC-BgAwvgMAAOQHADC_AwAAwQYAMAstAADTBwAwLgAA2AcAMLcDAADUBwAwuAMAANUHADC5AwAA1gcAILoDAADXBwAwuwMAANcHADC8AwAA1wcAML0DAADXBwAwvgMAANkHADC_AwAA2gcAMAstAADHBwAwLgAAzAcAMLcDAADIBwAwuAMAAMkHADC5AwAAygcAILoDAADLBwAwuwMAAMsHADC8AwAAywcAML0DAADLBwAwvgMAAM0HADC_AwAAzgcAMAstAAC7BwAwLgAAwAcAMLcDAAC8BwAwuAMAAL0HADC5AwAAvgcAILoDAAC_BwAwuwMAAL8HADC8AwAAvwcAML0DAAC_BwAwvgMAAMEHADC_AwAAwgcAMAstAACvBwAwLgAAtAcAMLcDAACwBwAwuAMAALEHADC5AwAAsgcAILoDAACzBwAwuwMAALMHADC8AwAAswcAML0DAACzBwAwvgMAALUHADC_AwAAtgcAMAstAACjBwAwLgAAqAcAMLcDAACkBwAwuAMAAKUHADC5AwAApgcAILoDAACnBwAwuwMAAKcHADC8AwAApwcAML0DAACnBwAwvgMAAKkHADC_AwAAqgcAMAstAACXBwAwLgAAnAcAMLcDAACYBwAwuAMAAJkHADC5AwAAmgcAILoDAACbBwAwuwMAAJsHADC8AwAAmwcAML0DAACbBwAwvgMAAJ0HADC_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_ACAtAADeBwAgAwAAAD8AIC0AAN4HACAuAADdBwAgASYAAOsIADALAwAA4QQAIMUCAADmBAAwxgIAAD0AEMcCAADmBAAwyAIBAAAAAcsCQACaBAAhzAJAAJoEACHYAgEAlQQAIdkCAQCVBAAh2gIBAJYEACHbAgEAlQQAIQIAAAA_ACAmAADdBwAgAgAAANsHACAmAADcBwAgCsUCAADaBwAwxgIAANsHABDHAgAA2gcAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHaAgEAlgQAIdsCAQCVBAAhCsUCAADaBwAwxgIAANsHABDHAgAA2gcAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdgCAQCVBAAh2QIBAJUEACHaAgEAlgQAIdsCAQCVBAAhBsgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHaAgEAjwUAIQbIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh2gIBAI8FACEGyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAABCAQAAO8FACAMAADuBQAgDQAA8AUAIMgCAQAAAAHLAkAAAAAB3AIBAAAAAeECAAAAgQMC_gIBAAAAAQIAAAARACAtAADnBwAgAwAAABEAIC0AAOcHACAuAADmBwAgASYAAOoIADACAAAAEQAgJgAA5gcAIAIAAADCBgAgJgAA5QcAIAXIAgEAhwUAIcsCQACIBQAh3AIBAIcFACHhAgAA3QWBAyL-AgEAhwUAIQgEAADfBQAgDAAA3gUAIA0AAOAFACDIAgEAhwUAIcsCQACIBQAh3AIBAIcFACHhAgAA3QWBAyL-AgEAhwUAIQgEAADvBQAgDAAA7gUAIA0AAPAFACDIAgEAAAABywJAAAAAAdwCAQAAAAHhAgAAAIEDAv4CAQAAAAEIBAAA7wUAIAwAAO4FACAOAADxBQAgyAIBAAAAAcsCQAAAAAHcAgEAAAAB4QIAAACBAwL_AgEAAAABAgAAABEAIC0AAPAHACADAAAAEQAgLQAA8AcAIC4AAO8HACABJgAA6QgAMAIAAAARACAmAADvBwAgAgAAAMIGACAmAADuBwAgBcgCAQCHBQAhywJAAIgFACHcAgEAhwUAIeECAADdBYEDIv8CAQCHBQAhCAQAAN8FACAMAADeBQAgDgAA4QUAIMgCAQCHBQAhywJAAIgFACHcAgEAhwUAIeECAADdBYEDIv8CAQCHBQAhCAQAAO8FACAMAADuBQAgDgAA8QUAIMgCAQAAAAHLAkAAAAAB3AIBAAAAAeECAAAAgQMC_wIBAAAAAQTIAgEAAAABywJAAAAAAcwCQAAAAAH9AgEAAAABAgAAADkAIC0AAPwHACADAAAAOQAgLQAA_AcAIC4AAPsHACABJgAA6AgAMAkDAADhBAAgxQIAAOcEADDGAgAANwAQxwIAAOcEADDIAgEAAAABywJAAJoEACHMAkAAmgQAIdsCAQCVBAAh_QIBAAAAAQIAAAA5ACAmAAD7BwAgAgAAAPkHACAmAAD6BwAgCMUCAAD4BwAwxgIAAPkHABDHAgAA-AcAMMgCAQCVBAAhywJAAJoEACHMAkAAmgQAIdsCAQCVBAAh_QIBAJUEACEIxQIAAPgHADDGAgAA-QcAEMcCAAD4BwAwyAIBAJUEACHLAkAAmgQAIcwCQACaBAAh2wIBAJUEACH9AgEAlQQAIQTIAgEAhwUAIcsCQACIBQAhzAJAAIgFACH9AgEAhwUAIQTIAgEAhwUAIcsCQACIBQAhzAJAAIgFACH9AgEAhwUAIQTIAgEAAAABywJAAAAAAcwCQAAAAAH9AgEAAAABBwsAANQFACDIAgEAAAABywJAAAAAAfkCAQAAAAH6AgEAAAAB-wIgAAAAAfwCAQAAAAECAAAAFQAgLQAAhQgAIAMAAAAVACAtAACFCAAgLgAAhAgAIAEmAADnCAAwAgAAABUAICYAAIQIACACAAAA6gUAICYAAIMIACAGyAIBAIcFACHLAkAAiAUAIfkCAQCHBQAh-gIBAIcFACH7AiAAsAUAIfwCAQCPBQAhBwsAANIFACDIAgEAhwUAIcsCQACIBQAh-QIBAIcFACH6AgEAhwUAIfsCIACwBQAh_AIBAI8FACEHCwAA1AUAIMgCAQAAAAHLAkAAAAAB-QIBAAAAAfoCAQAAAAH7AiAAAAAB_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_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIRYGAACBBgAgCgAAgwYAIA8AAIQGACASAACFBgAgEwAAhgYAIBUAAIcGACAWAACIBgAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIeECAAD_BYsDIoIDQACIBQAhgwMBAIcFACGEAwEAhwUAIYUDAAD8BQAghwMAAP0FhwMiiQMAAP4FiQMiiwMgAIAGACGMAwEAhwUAIY0DCAC3BQAhFgYAANMGACAKAADVBgAgDwAA1gYAIBIAANcGACATAADYBgAgFQAA2QYAIBYAANoGACDIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAYwDAQAAAAGNAwgAAAABBC0AAKoIADC3AwAAqwgAMLkDAACtCAAgvQMAAOQGADAELQAAoQgAMLcDAACiCAAwuQMAAKQIACC9AwAAygYAMAQtAACYCAAwtwMAAJkIADC5AwAAmwgAIL0DAAChBQAwBC0AAI8IADC3AwAAkAgAMLkDAACSCAAgvQMAAKkGADAELQAAhggAMLcDAACHCAAwuQMAAIkIACC9AwAAmQYAMAQtAAD9BwAwtwMAAP4HADC5AwAAgAgAIL0DAADmBQAwBC0AAPEHADC3AwAA8gcAMLkDAAD0BwAgvQMAAPUHADAELQAA6AcAMLcDAADpBwAwuQMAAOsHACC9AwAAvgYAMAQtAADfBwAwtwMAAOAHADC5AwAA4gcAIL0DAAC-BgAwBC0AANMHADC3AwAA1AcAMLkDAADWBwAgvQMAANcHADAELQAAxwcAMLcDAADIBwAwuQMAAMoHACC9AwAAywcAMAQtAAC7BwAwtwMAALwHADC5AwAAvgcAIL0DAAC_BwAwBC0AAK8HADC3AwAAsAcAMLkDAACyBwAgvQMAALMHADAELQAAowcAMLcDAACkBwAwuQMAAKYHACC9AwAApwcAMAQtAACXBwAwtwMAAJgHADC5AwAAmgcAIL0DAACbBwAwAAAAAAAAAAAAAAAAAAAAAAAFLQAA3QgAIC4AAOAIACC3AwAA3ggAILgDAADfCAAgvQMAAHgAIAMtAADdCAAgtwMAAN4IACC9AwAAeAAgEwoAAMMIACAMAADHCAAgEgAAxAgAIBMAAMUIACAVAADGCAAgFwAAwggAIBgAAMgIACAZAADJCAAgGgAAyQgAIBsAAMoIACAcAADLCAAgHQAAzAgAIB4AAM0IACAfAADOCAAgIAAAzwgAIOkCAACLBQAgpwMAAIsFACCoAwAAiwUAIK4DAACLBQAgCQYAANsIACAHAADVCAAgCgAAwwgAIA8AAMkIACASAADECAAgEwAAxQgAIBUAAMYIACAWAADcCAAgiwMAAIsFACADAwAA1QgAIAQAANYIACAJAADaCAAgBQMAANUIACAEAADWCAAgEAAA2AgAIBEAAMQIACDfAgAAiwUAIAQEAADWCAAgDAAAxwgAIA0AANUIACAOAADVCAAgBgMAANUIACAEAADWCAAgCAAA1wgAIPACAACLBQAg8QIAAIsFACDyAgAAiwUAIAIDAADVCAAgBAAAwggAIAAfCgAAtAgAIAwAALgIACASAAC1CAAgEwAAtggAIBUAALcIACAXAACzCAAgGAAAuQgAIBkAALoIACAaAAC7CAAgGwAAvAgAIBwAAL0IACAdAAC-CAAgHgAAvwgAIB8AAMAIACDIAgEAAAABywJAAAAAAcwCQAAAAAHhAgAAAKcDAugCIAAAAAHpAkAAAAAB_QIBAAAAAYEDAQAAAAGTAwEAAAABpQMAAAClAwKnAwEAAAABqAMBAAAAAakDIAAAAAGqAyAAAAABrAMAAACsAwKtAwIAAAABrgNAAAAAAQIAAAB4ACAtAADdCAAgAwAAAHsAIC0AAN0IACAuAADhCAAgIQAAAHsAIAoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgJgAA4QgAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEfCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhD8gCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjAMBAAAAAY0DCAAAAAEFyAIBAAAAAdwCAQAAAAHhAgAAAPcCAvcCAAAA9QIC-AJAAAAAAQfIAgEAAAABywJAAAAAAdwCAQAAAAHdAgIAAAAB3gIBAAAAAd8CAQAAAAHhAgAAAOECAgnIAgEAAAABywJAAAAAAdwCAQAAAAHhAgAAAPUCAvACAQAAAAHxAgEAAAAB8gKAAAAAAfMCCAAAAAH1AgEAAAABB8gCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHcAgEAAAAB5gIBAAAAAYUDAACjBgAgBsgCAQAAAAHLAkAAAAAB-QIBAAAAAfoCAQAAAAH7AiAAAAAB_AIBAAAAAQTIAgEAAAABywJAAAAAAcwCQAAAAAH9AgEAAAABBcgCAQAAAAHLAkAAAAAB3AIBAAAAAeECAAAAgQMC_wIBAAAAAQXIAgEAAAABywJAAAAAAdwCAQAAAAHhAgAAAIEDAv4CAQAAAAEGyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAABB8gCAQAAAAHLAkAAAAABzAJAAAAAAZcDQAAAAAGhAwEAAAABogMBAAAAAaMDAQAAAAEMyAIBAAAAAcsCQAAAAAHMAkAAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDAQAAAAGdA0AAAAABngNAAAAAAZ8DAQAAAAGgAwEAAAABBsgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAABgQMBAAAAAQXIAgEAAAABywJAAAAAAcwCQAAAAAGBAwEAAAABkwMBAAAAAQXIAgEAAAABywJAAAAAAcwCQAAAAAGyAwEAAAABswMBAAAAAR8KAAC0CAAgDAAAuAgAIBIAALUIACATAAC2CAAgFQAAtwgAIBcAALMIACAYAAC5CAAgGQAAuggAIBoAALsIACAbAAC8CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABAgAAAHgAIC0AAPEIACADAAAAewAgLQAA8QgAIC4AAPUIACAhAAAAewAgCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACAmAAD1CAAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEfCgAAtAgAIAwAALgIACASAAC1CAAgEwAAtggAIBUAALcIACAXAACzCAAgGAAAuQgAIBkAALoIACAaAAC7CAAgGwAAvAgAIBwAAL0IACAeAAC_CAAgHwAAwAgAICAAAMEIACDIAgEAAAABywJAAAAAAcwCQAAAAAHhAgAAAKcDAugCIAAAAAHpAkAAAAAB_QIBAAAAAYEDAQAAAAGTAwEAAAABpQMAAAClAwKnAwEAAAABqAMBAAAAAakDIAAAAAGqAyAAAAABrAMAAACsAwKtAwIAAAABrgNAAAAAAQIAAAB4ACAtAAD2CAAgAwAAAHsAIC0AAPYIACAuAAD6CAAgIQAAAHsAIAoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgJgAA-ggAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEfCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAeAACUBwAgHwAAlQcAICAAAJYHACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhFwYAANMGACAHAADUBgAgCgAA1QYAIA8AANYGACASAADXBgAgEwAA2AYAIBYAANoGACDIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAYwDAQAAAAGNAwgAAAABjgMBAAAAAQIAAAAFACAtAAD7CAAgAwAAAAMAIC0AAPsIACAuAAD_CAAgGQAAAAMAIAYAAIEGACAHAACCBgAgCgAAgwYAIA8AAIQGACASAACFBgAgEwAAhgYAIBYAAIgGACAmAAD_CAAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIeECAAD_BYsDIoIDQACIBQAhgwMBAIcFACGEAwEAhwUAIYUDAAD8BQAghwMAAP0FhwMiiQMAAP4FiQMiiwMgAIAGACGMAwEAhwUAIY0DCAC3BQAhjgMBAIcFACEXBgAAgQYAIAcAAIIGACAKAACDBgAgDwAAhAYAIBIAAIUGACATAACGBgAgFgAAiAYAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHhAgAA_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIY4DAQCHBQAhHwoAALQIACAMAAC4CAAgEgAAtQgAIBMAALYIACAVAAC3CAAgFwAAswgAIBgAALkIACAZAAC6CAAgGgAAuwgAIBsAALwIACAcAAC9CAAgHQAAvggAIB4AAL8IACAgAADBCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAECAAAAeAAgLQAAgAkAIA_IAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAY0DCAAAAAGOAwEAAAABAwAAAHsAIC0AAIAJACAuAACFCQAgIQAAAHsAIAoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAgAACWBwAgJgAAhQkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEfCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAICAAAJYHACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAALQIACAMAAC4CAAgEgAAtQgAIBMAALYIACAVAAC3CAAgGAAAuQgAIBkAALoIACAaAAC7CAAgGwAAvAgAIBwAAL0IACAdAAC-CAAgHgAAvwgAIB8AAMAIACAgAADBCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAECAAAAeAAgLQAAhgkAIAcDAADsBgAgyAIBAAAAAcsCQAAAAAHMAkAAAAABgQMBAAAAAZIDAQAAAAGTAwEAAAABAgAAAE8AIC0AAIgJACAFyAIBAAAAAdsCAQAAAAHhAgAAAPcCAvcCAAAA9QIC-AJAAAAAAQXIAgEAAAABywJAAAAAAeECAAAAgQMC_gIBAAAAAf8CAQAAAAEHyAIBAAAAAcsCQAAAAAHbAgEAAAAB3QICAAAAAd4CAQAAAAHfAgEAAAAB4QIAAADhAgIJyAIBAAAAAcsCQAAAAAHbAgEAAAAB4QIAAAD1AgLwAgEAAAAB8QIBAAAAAfICgAAAAAHzAggAAAAB9QIBAAAAAR8KAAC0CAAgDAAAuAgAIBIAALUIACATAAC2CAAgFwAAswgAIBgAALkIACAZAAC6CAAgGgAAuwgAIBsAALwIACAcAAC9CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABAgAAAHgAIC0AAI4JACADAAAAewAgLQAAjgkAIC4AAJIJACAhAAAAewAgCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHAAAkgcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACAmAACSCQAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEHyAIBAAAAAcsCQAAAAAHMAkAAAAAB2AIBAAAAAeYCAQAAAAGFAwAAowYAIJQDAQAAAAEFBgEAAAAByAIBAAAAAckCAQAAAAHLAkAAAAABzAJAAAAAAQMAAAB7ACAtAACGCQAgLgAAlwkAICEAAAB7ACAKAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAICYAAJcJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIQMAAABNACAtAACICQAgLgAAmgkAIAkAAABNACADAADeBgAgJgAAmgkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIYEDAQCHBQAhkgMBAIcFACGTAwEAhwUAIQcDAADeBgAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAhgQMBAIcFACGSAwEAhwUAIZMDAQCHBQAhHwoAALQIACAMAAC4CAAgEgAAtQgAIBMAALYIACAVAAC3CAAgFwAAswgAIBgAALkIACAZAAC6CAAgGgAAuwgAIBsAALwIACAcAAC9CAAgHQAAvggAIB8AAMAIACAgAADBCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAECAAAAeAAgLQAAmwkAIAMAAAB7ACAtAACbCQAgLgAAnwkAICEAAAB7ACAKAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHAAAkgcAIB0AAJMHACAfAACVBwAgIAAAlgcAICYAAJ8JACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAAC0CAAgDAAAuAgAIBIAALUIACATAAC2CAAgFQAAtwgAIBcAALMIACAYAAC5CAAgGQAAuggAIBsAALwIACAcAAC9CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABAgAAAHgAIC0AAKAJACAfCgAAtAgAIAwAALgIACASAAC1CAAgEwAAtggAIBUAALcIACAXAACzCAAgGAAAuQgAIBoAALsIACAbAAC8CAAgHAAAvQgAIB0AAL4IACAeAAC_CAAgHwAAwAgAICAAAMEIACDIAgEAAAABywJAAAAAAcwCQAAAAAHhAgAAAKcDAugCIAAAAAHpAkAAAAAB_QIBAAAAAYEDAQAAAAGTAwEAAAABpQMAAAClAwKnAwEAAAABqAMBAAAAAakDIAAAAAGqAyAAAAABrAMAAACsAwKtAwIAAAABrgNAAAAAAQIAAAB4ACAtAACiCQAgFwYAANMGACAHAADUBgAgCgAA1QYAIBIAANcGACATAADYBgAgFQAA2QYAIBYAANoGACDIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAYwDAQAAAAGNAwgAAAABjgMBAAAAAQIAAAAFACAtAACkCQAgBsgCAQAAAAHLAkAAAAAB2wIBAAAAAfkCAQAAAAH6AgEAAAAB-wIgAAAAAQMAAAB7ACAtAACgCQAgLgAAqQkAICEAAAB7ACAKAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAICYAAKkJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIQMAAAB7ACAtAACiCQAgLgAArAkAICEAAAB7ACAKAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAICYAAKwJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAAIkHACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIQMAAAADACAtAACkCQAgLgAArwkAIBkAAAADACAGAACBBgAgBwAAggYAIAoAAIMGACASAACFBgAgEwAAhgYAIBUAAIcGACAWAACIBgAgJgAArwkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHhAgAA_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIY4DAQCHBQAhFwYAAIEGACAHAACCBgAgCgAAgwYAIBIAAIUGACATAACGBgAgFQAAhwYAIBYAAIgGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIR8KAAC0CAAgDAAAuAgAIBIAALUIACATAAC2CAAgFQAAtwgAIBcAALMIACAZAAC6CAAgGgAAuwgAIBsAALwIACAcAAC9CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABAgAAAHgAIC0AALAJACADAAAAewAgLQAAsAkAIC4AALQJACAhAAAAewAgCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHAAAkgcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACAmAAC0CQAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEJBAAA7wUAIA0AAPAFACAOAADxBQAgyAIBAAAAAcsCQAAAAAHcAgEAAAAB4QIAAACBAwL-AgEAAAAB_wIBAAAAAQIAAAARACAtAAC1CQAgHwoAALQIACASAAC1CAAgEwAAtggAIBUAALcIACAXAACzCAAgGAAAuQgAIBkAALoIACAaAAC7CAAgGwAAvAgAIBwAAL0IACAdAAC-CAAgHgAAvwgAIB8AAMAIACAgAADBCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAECAAAAeAAgLQAAtwkAIAMAAAAPACAtAAC1CQAgLgAAuwkAIAsAAAAPACAEAADfBQAgDQAA4AUAIA4AAOEFACAmAAC7CQAgyAIBAIcFACHLAkAAiAUAIdwCAQCHBQAh4QIAAN0FgQMi_gIBAIcFACH_AgEAhwUAIQkEAADfBQAgDQAA4AUAIA4AAOEFACDIAgEAhwUAIcsCQACIBQAh3AIBAIcFACHhAgAA3QWBAyL-AgEAhwUAIf8CAQCHBQAhAwAAAHsAIC0AALcJACAuAAC-CQAgIQAAAHsAIAoAAIkHACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgJgAAvgkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEfCgAAiQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHAAAkgcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhFwYAANMGACAHAADUBgAgDwAA1gYAIBIAANcGACATAADYBgAgFQAA2QYAIBYAANoGACDIAgEAAAABywJAAAAAAcwCQAAAAAHYAgEAAAAB2QIBAAAAAeECAAAAiwMCggNAAAAAAYMDAQAAAAGEAwEAAAABhQMAANIGACCHAwAAAIcDAokDAAAAiQMCiwMgAAAAAYwDAQAAAAGNAwgAAAABjgMBAAAAAQIAAAAFACAtAAC_CQAgHwwAALgIACASAAC1CAAgEwAAtggAIBUAALcIACAXAACzCAAgGAAAuQgAIBkAALoIACAaAAC7CAAgGwAAvAgAIBwAAL0IACAdAAC-CAAgHgAAvwgAIB8AAMAIACAgAADBCAAgyAIBAAAAAcsCQAAAAAHMAkAAAAAB4QIAAACnAwLoAiAAAAAB6QJAAAAAAf0CAQAAAAGBAwEAAAABkwMBAAAAAaUDAAAApQMCpwMBAAAAAagDAQAAAAGpAyAAAAABqgMgAAAAAawDAAAArAMCrQMCAAAAAa4DQAAAAAECAAAAeAAgLQAAwQkAIAMAAAADACAtAAC_CQAgLgAAxQkAIBkAAAADACAGAACBBgAgBwAAggYAIA8AAIQGACASAACFBgAgEwAAhgYAIBUAAIcGACAWAACIBgAgJgAAxQkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHhAgAA_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIY4DAQCHBQAhFwYAAIEGACAHAACCBgAgDwAAhAYAIBIAAIUGACATAACGBgAgFQAAhwYAIBYAAIgGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIQMAAAB7ACAtAADBCQAgLgAAyAkAICEAAAB7ACAMAACNBwAgEgAAigcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAICYAAMgJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIQgDAADLBQAgBAAAzAUAIMgCAQAAAAHbAgEAAAAB3AIBAAAAAeECAAAA9wIC9wIAAAD1AgL4AkAAAAABAgAAAAsAIC0AAMkJACAXBgAA0wYAIAcAANQGACAKAADVBgAgDwAA1gYAIBIAANcGACAVAADZBgAgFgAA2gYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjAMBAAAAAY0DCAAAAAGOAwEAAAABAgAAAAUAIC0AAMsJACAfCgAAtAgAIAwAALgIACASAAC1CAAgFQAAtwgAIBcAALMIACAYAAC5CAAgGQAAuggAIBoAALsIACAbAAC8CAAgHAAAvQgAIB0AAL4IACAeAAC_CAAgHwAAwAgAICAAAMEIACDIAgEAAAABywJAAAAAAcwCQAAAAAHhAgAAAKcDAugCIAAAAAHpAkAAAAAB_QIBAAAAAYEDAQAAAAGTAwEAAAABpQMAAAClAwKnAwEAAAABqAMBAAAAAakDIAAAAAGqAyAAAAABrAMAAACsAwKtAwIAAAABrgNAAAAAAQIAAAB4ACAtAADNCQAgAwAAAAkAIC0AAMkJACAuAADRCQAgCgAAAAkAIAMAAMMFACAEAADEBQAgJgAA0QkAIMgCAQCHBQAh2wIBAIcFACHcAgEAhwUAIeECAADCBfcCIvcCAAC4BfUCIvgCQACIBQAhCAMAAMMFACAEAADEBQAgyAIBAIcFACHbAgEAhwUAIdwCAQCHBQAh4QIAAMIF9wIi9wIAALgF9QIi-AJAAIgFACEDAAAAAwAgLQAAywkAIC4AANQJACAZAAAAAwAgBgAAgQYAIAcAAIIGACAKAACDBgAgDwAAhAYAIBIAAIUGACAVAACHBgAgFgAAiAYAICYAANQJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIRcGAACBBgAgBwAAggYAIAoAAIMGACAPAACEBgAgEgAAhQYAIBUAAIcGACAWAACIBgAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIeECAAD_BYsDIoIDQACIBQAhgwMBAIcFACGEAwEAhwUAIYUDAAD8BQAghwMAAP0FhwMiiQMAAP4FiQMiiwMgAIAGACGMAwEAhwUAIY0DCAC3BQAhjgMBAIcFACEDAAAAewAgLQAAzQkAIC4AANcJACAhAAAAewAgCgAAiQcAIAwAAI0HACASAACKBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAbAACRBwAgHAAAkgcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACAmAADXCQAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAACJBwAgDAAAjQcAIBIAAIoHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACELAwAAqQUAIAQAAKoFACAQAACsBQAgyAIBAAAAAcsCQAAAAAHbAgEAAAAB3AIBAAAAAd0CAgAAAAHeAgEAAAAB3wIBAAAAAeECAAAA4QICAgAAABsAIC0AANgJACAXBgAA0wYAIAcAANQGACAKAADVBgAgDwAA1gYAIBMAANgGACAVAADZBgAgFgAA2gYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjAMBAAAAAY0DCAAAAAGOAwEAAAABAgAAAAUAIC0AANoJACAfCgAAtAgAIAwAALgIACATAAC2CAAgFQAAtwgAIBcAALMIACAYAAC5CAAgGQAAuggAIBoAALsIACAbAAC8CAAgHAAAvQgAIB0AAL4IACAeAAC_CAAgHwAAwAgAICAAAMEIACDIAgEAAAABywJAAAAAAcwCQAAAAAHhAgAAAKcDAugCIAAAAAHpAkAAAAAB_QIBAAAAAYEDAQAAAAGTAwEAAAABpQMAAAClAwKnAwEAAAABqAMBAAAAAakDIAAAAAGqAyAAAAABrAMAAACsAwKtAwIAAAABrgNAAAAAAQIAAAB4ACAtAADcCQAgB8gCAQAAAAHLAkAAAAAB2wIBAAAAAdwCAQAAAAHdAgIAAAAB3gIBAAAAAeECAAAA4QICAwAAABkAIC0AANgJACAuAADhCQAgDQAAABkAIAMAAJkFACAEAACaBQAgEAAAmwUAICYAAOEJACDIAgEAhwUAIcsCQACIBQAh2wIBAIcFACHcAgEAhwUAId0CAgCXBQAh3gIBAIcFACHfAgEAjwUAIeECAACYBeECIgsDAACZBQAgBAAAmgUAIBAAAJsFACDIAgEAhwUAIcsCQACIBQAh2wIBAIcFACHcAgEAhwUAId0CAgCXBQAh3gIBAIcFACHfAgEAjwUAIeECAACYBeECIgMAAAADACAtAADaCQAgLgAA5AkAIBkAAAADACAGAACBBgAgBwAAggYAIAoAAIMGACAPAACEBgAgEwAAhgYAIBUAAIcGACAWAACIBgAgJgAA5AkAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIdgCAQCHBQAh2QIBAIcFACHhAgAA_wWLAyKCA0AAiAUAIYMDAQCHBQAhhAMBAIcFACGFAwAA_AUAIIcDAAD9BYcDIokDAAD-BYkDIosDIACABgAhjAMBAIcFACGNAwgAtwUAIY4DAQCHBQAhFwYAAIEGACAHAACCBgAgCgAAgwYAIA8AAIQGACATAACGBgAgFQAAhwYAIBYAAIgGACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIQMAAAB7ACAtAADcCQAgLgAA5wkAICEAAAB7ACAKAACJBwAgDAAAjQcAIBMAAIsHACAVAACMBwAgFwAAiAcAIBgAAI4HACAZAACPBwAgGgAAkAcAIBsAAJEHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAICYAAOcJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHhAgAAhgenAyLoAiAAsAUAIekCQACxBQAh_QIBAIcFACGBAwEAhwUAIZMDAQCHBQAhpQMAAIUHpQMipwMBAI8FACGoAwEAjwUAIakDIACwBQAhqgMgALAFACGsAwAAhwesAyKtAwIAlwUAIa4DQACxBQAhHwoAAIkHACAMAACNBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgGwAAkQcAIBwAAJIHACAdAACTBwAgHgAAlAcAIB8AAJUHACAgAACWBwAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAAC0CAAgDAAAuAgAIBIAALUIACATAAC2CAAgFQAAtwgAIBcAALMIACAYAAC5CAAgGQAAuggAIBoAALsIACAcAAC9CAAgHQAAvggAIB4AAL8IACAfAADACAAgIAAAwQgAIMgCAQAAAAHLAkAAAAABzAJAAAAAAeECAAAApwMC6AIgAAAAAekCQAAAAAH9AgEAAAABgQMBAAAAAZMDAQAAAAGlAwAAAKUDAqcDAQAAAAGoAwEAAAABqQMgAAAAAaoDIAAAAAGsAwAAAKwDAq0DAgAAAAGuA0AAAAABAgAAAHgAIC0AAOgJACADAAAAewAgLQAA6AkAIC4AAOwJACAhAAAAewAgCgAAiQcAIAwAAI0HACASAACKBwAgEwAAiwcAIBUAAIwHACAXAACIBwAgGAAAjgcAIBkAAI8HACAaAACQBwAgHAAAkgcAIB0AAJMHACAeAACUBwAgHwAAlQcAICAAAJYHACAmAADsCQAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh4QIAAIYHpwMi6AIgALAFACHpAkAAsQUAIf0CAQCHBQAhgQMBAIcFACGTAwEAhwUAIaUDAACFB6UDIqcDAQCPBQAhqAMBAI8FACGpAyAAsAUAIaoDIACwBQAhrAMAAIcHrAMirQMCAJcFACGuA0AAsQUAIR8KAACJBwAgDAAAjQcAIBIAAIoHACATAACLBwAgFQAAjAcAIBcAAIgHACAYAACOBwAgGQAAjwcAIBoAAJAHACAcAACSBwAgHQAAkwcAIB4AAJQHACAfAACVBwAgIAAAlgcAIMgCAQCHBQAhywJAAIgFACHMAkAAiAUAIeECAACGB6cDIugCIACwBQAh6QJAALEFACH9AgEAhwUAIYEDAQCHBQAhkwMBAIcFACGlAwAAhQelAyKnAwEAjwUAIagDAQCPBQAhqQMgALAFACGqAyAAsAUAIawDAACHB6wDIq0DAgCXBQAhrgNAALEFACEXBgAA0wYAIAcAANQGACAKAADVBgAgDwAA1gYAIBIAANcGACATAADYBgAgFQAA2QYAIMgCAQAAAAHLAkAAAAABzAJAAAAAAdgCAQAAAAHZAgEAAAAB4QIAAACLAwKCA0AAAAABgwMBAAAAAYQDAQAAAAGFAwAA0gYAIIcDAAAAhwMCiQMAAACJAwKLAyAAAAABjAMBAAAAAY0DCAAAAAGOAwEAAAABAgAAAAUAIC0AAO0JACADAAAAAwAgLQAA7QkAIC4AAPEJACAZAAAAAwAgBgAAgQYAIAcAAIIGACAKAACDBgAgDwAAhAYAIBIAAIUGACATAACGBgAgFQAAhwYAICYAAPEJACDIAgEAhwUAIcsCQACIBQAhzAJAAIgFACHYAgEAhwUAIdkCAQCHBQAh4QIAAP8FiwMiggNAAIgFACGDAwEAhwUAIYQDAQCHBQAhhQMAAPwFACCHAwAA_QWHAyKJAwAA_gWJAyKLAyAAgAYAIYwDAQCHBQAhjQMIALcFACGOAwEAhwUAIRcGAACBBgAgBwAAggYAIAoAAIMGACAPAACEBgAgEgAAhQYAIBMAAIYGACAVAACHBgAgyAIBAIcFACHLAkAAiAUAIcwCQACIBQAh2AIBAIcFACHZAgEAhwUAIeECAAD_BYsDIoIDQACIBQAhgwMBAIcFACGEAwEAhwUAIYUDAAD8BQAghwMAAP0FhwMiiQMAAP4FiQMiiwMgAIAGACGMAwEAhwUAIY0DCAC3BQAhjgMBAIcFACEBAwACEAUAFQoyBgw2CRIzCxM0BxU1DRcGAxg6EBk7CBo8CBtAERxEEh1IEx5MFB9QBCBTAQkFAA8GAAQHAAIKDAYPEggSHAsTIgcVJg0WKw4DAwACBAcDBQAFAQQIAAMDAAIEAAMJDgcDAwACBAADCAAGBQQAAwUACgwWCQ0AAg4AAgIDAAILFwgBDBgABQMAAgQAAwUADBAdCxEeCwERHwACBCcDFAACAQQAAwYKLAAPLQASLgATLwAVMAAWMQABAwACAQMAAgEDAAIBAwACAQMAAg8KVQAMWQASVgATVwAVWAAXVAAYWgAZWwAaXAAbXQAcXgAdXwAeYAAfYQAgYgAAAQMAAgEDAAIDBQAaMwAbNAAcAAAAAwUAGjMAGzQAHAAABQUAITMAJDQAJUUAIkYAIwAAAAAABQUAITMAJDQAJUUAIkYAIwEDAAIBAwACAwUAKjMAKzQALAAAAAMFACozACs0ACwBAwACAQMAAgMFADEzADI0ADMAAAADBQAxMwAyNAAzAAAAAwUAOTMAOjQAOwAAAAMFADkzADo0ADsCBOABAxQAAgIE5gEDFAACAwUAQDMAQTQAQgAAAAMFAEAzAEE0AEIBAwACAQMAAgMFAEczAEg0AEkAAAADBQBHMwBINABJAgYABAcAAgIGAAQHAAIFBQBOMwBRNABSRQBPRgBQAAAAAAAFBQBOMwBRNABSRQBPRgBQAQMAAgEDAAIDBQBXMwBYNABZAAAAAwUAVzMAWDQAWQMEAAMNAAIOAAIDBAADDQACDgACAwUAXjMAXzQAYAAAAAMFAF4zAF80AGABAwACAQMAAgMFAGUzAGY0AGcAAAADBQBlMwBmNABnAgMAAgvmAggCAwACC-wCCAMFAGwzAG00AG4AAAADBQBsMwBtNABuAgMAAgQAAwIDAAIEAAMDBQBzMwB0NAB1AAAAAwUAczMAdDQAdQMDAAIEAAMIAAYDAwACBAADCAAGBQUAejMAfTQAfkUAe0YAfAAAAAAABQUAejMAfTQAfkUAe0YAfAAAAwUAgwEzAIQBNACFAQAAAAMFAIMBMwCEATQAhQEDAwACBAADEL0DCwMDAAIEAAMQwwMLBQUAigEzAI0BNACOAUUAiwFGAIwBAAAAAAAFBQCKATMAjQE0AI4BRQCLAUYAjAEBAwACAQMAAgMFAJMBMwCUATQAlQEAAAADBQCTATMAlAE0AJUBAQQAAwEEAAMDBQCaATMAmwE0AJwBAAAAAwUAmgEzAJsBNACcASECASJjASNkASRlASVmASdoAShqFilrFyptAStvFixwGC9xATByATFzFjV2GTZ3HTd5Ajh6Ajl9Ajp-Ajt_AjyBAQI9gwEWPoQBHj-GAQJAiAEWQYkBH0KKAQJDiwECRIwBFkePASBIkAEmSZEBEkqSARJLkwESTJQBEk2VARJOlwEST5kBFlCaASdRnAESUp4BFlOfAShUoAESVaEBElaiARZXpQEpWKYBLVmnARNaqAETW6kBE1yqARNdqwETXq0BE1-vARZgsAEuYbIBE2K0ARZjtQEvZLYBE2W3ARNmuAEWZ7sBMGi8ATRpvgE1ar8BNWvCATVswwE1bcQBNW7GATVvyAEWcMkBNnHLATVyzQEWc84BN3TPATV10AE1dtEBFnfUATh41QE8edYBDXrXAQ172AENfNkBDX3aAQ1-3AENf94BFoAB3wE9gQHiAQ2CAeQBFoMB5QE-hAHnAQ2FAegBDYYB6QEWhwHsAT-IAe0BQ4kB7gEEigHvAQSLAfABBIwB8QEEjQHyAQSOAfQBBI8B9gEWkAH3AUSRAfkBBJIB-wEWkwH8AUWUAf0BBJUB_gEElgH_ARaXAYICRpgBgwJKmQGEAgOaAYUCA5sBhgIDnAGHAgOdAYgCA54BigIDnwGMAhagAY0CS6EBjwIDogGRAhajAZICTKQBkwIDpQGUAgOmAZUCFqcBmAJNqAGZAlOpAZoCFKoBmwIUqwGcAhSsAZ0CFK0BngIUrgGgAhSvAaICFrABowJUsQGlAhSyAacCFrMBqAJVtAGpAhS1AaoCFLYBqwIWtwGuAla4Aa8CWrkBsAIIugGxAgi7AbICCLwBswIIvQG0Agi-AbYCCL8BuAIWwAG5AlvBAbsCCMIBvQIWwwG-AlzEAb8CCMUBwAIIxgHBAhbHAcQCXcgBxQJhyQHGAhDKAccCEMsByAIQzAHJAhDNAcoCEM4BzAIQzwHOAhbQAc8CYtEB0QIQ0gHTAhbTAdQCY9QB1QIQ1QHWAhDWAdcCFtcB2gJk2AHbAmjZAdwCCdoB3QIJ2wHeAgncAd8CCd0B4AIJ3gHiAgnfAeQCFuAB5QJp4QHoAgniAeoCFuMB6wJq5AHtAgnlAe4CCeYB7wIW5wHyAmvoAfMCb-kB9AIG6gH1AgbrAfYCBuwB9wIG7QH4AgbuAfoCBu8B_AIW8AH9AnDxAf8CBvIBgQMW8wGCA3H0AYMDBvUBhAMG9gGFAxb3AYgDcvgBiQN2-QGKAwf6AYsDB_sBjAMH_AGNAwf9AY4DB_4BkAMH_wGSAxaAApMDd4EClQMHggKXAxaDApgDeIQCmQMHhQKaAweGApsDFocCngN5iAKfA3-JAqEDgAGKAqIDgAGLAqUDgAGMAqYDgAGNAqcDgAGOAqkDgAGPAqsDFpACrAOBAZECrQOAAZICrgMWkwKxA4IBlAKyA4YBlQKzAwuWArQDC5cCtQMLmAK2AwuZArcDC5oCuQMLmwK7AxacArwDhwGdAr8DC54CwQMWnwLCA4gBoALEAwuhAsUDC6ICxgMWowLJA4kBpALKA48BpQLLAxGmAswDEacCzQMRqALOAxGpAs8DEaoC0QMRqwLTAxasAtQDkAGtAtYDEa4C2AMWrwLZA5EBsALaAxGxAtsDEbIC3AMWswLfA5IBtALgA5YBtQLhAw62AuIDDrcC4wMOuALkAw65AuUDDroC5wMOuwLpAxa8AuoDlwG9AuwDDr4C7gMWvwLvA5gBwALwAw7BAvEDDsIC8gMWwwL1A5kBxAL2A50B"
    };
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AIContentScalarFieldEnum: () => AIContentScalarFieldEnum,
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BlogScalarFieldEnum: () => BlogScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DocumentEmbeddingScalarFieldEnum: () => DocumentEmbeddingScalarFieldEnum,
  EventScalarFieldEnum: () => EventScalarFieldEnum,
  HighlightScalarFieldEnum: () => HighlightScalarFieldEnum,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NewsletterScalarFieldEnum: () => NewsletterScalarFieldEnum,
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
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserActivityScalarFieldEnum: () => UserActivityScalarFieldEnum,
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
var PrismaClientKnownRequestError2, PrismaClientUnknownRequestError2, PrismaClientRustPanicError2, PrismaClientInitializationError2, PrismaClientValidationError2, sql, empty2, join2, raw2, Sql2, Decimal2, getExtensionContext, prismaVersion, NullTypes2, DbNull2, JsonNull2, AnyNull2, ModelName, TransactionIsolationLevel, AIContentScalarFieldEnum, UserScalarFieldEnum, SessionScalarFieldEnum, AccountScalarFieldEnum, VerificationScalarFieldEnum, BlogScalarFieldEnum, CategoryScalarFieldEnum, EventScalarFieldEnum, HighlightScalarFieldEnum, InvitationScalarFieldEnum, NewsletterScalarFieldEnum, NotificationScalarFieldEnum, ParticipantScalarFieldEnum, PaymentScalarFieldEnum, DocumentEmbeddingScalarFieldEnum, ReviewScalarFieldEnum, ServiceScalarFieldEnum, UserActivityScalarFieldEnum, SortOrder, NullableJsonNullValueInput, QueryMode, NullsOrder, JsonNullValueFilter, defineExtension;
var init_prismaNamespace = __esm({
  "src/generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
    PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
    PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
    PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
    PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
    sql = runtime2.sqltag;
    empty2 = runtime2.empty;
    join2 = runtime2.join;
    raw2 = runtime2.raw;
    Sql2 = runtime2.Sql;
    Decimal2 = runtime2.Decimal;
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    prismaVersion = {
      client: "7.5.0",
      engine: "280c870be64f457428992c43c1f6d557fab6e29e"
    };
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    DbNull2 = runtime2.DbNull;
    JsonNull2 = runtime2.JsonNull;
    AnyNull2 = runtime2.AnyNull;
    ModelName = {
      AIContent: "AIContent",
      User: "User",
      Session: "Session",
      Account: "Account",
      Verification: "Verification",
      Blog: "Blog",
      Category: "Category",
      Event: "Event",
      Highlight: "Highlight",
      Invitation: "Invitation",
      Newsletter: "Newsletter",
      Notification: "Notification",
      Participant: "Participant",
      Payment: "Payment",
      DocumentEmbedding: "DocumentEmbedding",
      Review: "Review",
      Service: "Service",
      UserActivity: "UserActivity"
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    AIContentScalarFieldEnum = {
      id: "id",
      prompt: "prompt",
      generatedText: "generatedText",
      updatedAt: "updatedAt",
      userId: "userId",
      createdAt: "createdAt"
    };
    UserScalarFieldEnum = {
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
      updatedAt: "updatedAt",
      plan: "plan",
      promptCount: "promptCount",
      promptResetAt: "promptResetAt"
    };
    SessionScalarFieldEnum = {
      id: "id",
      expiresAt: "expiresAt",
      token: "token",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      userId: "userId"
    };
    AccountScalarFieldEnum = {
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
    VerificationScalarFieldEnum = {
      id: "id",
      identifier: "identifier",
      value: "value",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    BlogScalarFieldEnum = {
      id: "id",
      title: "title",
      content: "content",
      images: "images",
      authorId: "authorId",
      eventId: "eventId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    CategoryScalarFieldEnum = {
      id: "id",
      adminId: "adminId",
      name: "name",
      image: "image",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    EventScalarFieldEnum = {
      id: "id",
      title: "title",
      description: "description",
      date: "date",
      time: "time",
      location: "location",
      images: "images",
      visibility: "visibility",
      priceType: "priceType",
      status: "status",
      is_featured: "is_featured",
      category_name: "category_name",
      fee: "fee",
      organizerId: "organizerId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    HighlightScalarFieldEnum = {
      id: "id",
      title: "title",
      description: "description",
      image: "image",
      userId: "userId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    InvitationScalarFieldEnum = {
      id: "id",
      eventId: "eventId",
      inviterId: "inviterId",
      inviteeId: "inviteeId",
      status: "status",
      createdAt: "createdAt"
    };
    NewsletterScalarFieldEnum = {
      id: "id",
      email: "email",
      userId: "userId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    NotificationScalarFieldEnum = {
      id: "id",
      userId: "userId",
      message: "message",
      type: "type",
      read: "read",
      invitationId: "invitationId",
      createdAt: "createdAt"
    };
    ParticipantScalarFieldEnum = {
      id: "id",
      userId: "userId",
      eventId: "eventId",
      status: "status",
      paymentStatus: "paymentStatus",
      joinedAt: "joinedAt"
    };
    PaymentScalarFieldEnum = {
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
    DocumentEmbeddingScalarFieldEnum = {
      id: "id",
      chunkKey: "chunkKey",
      sourceType: "sourceType",
      sourceId: "sourceId",
      sourceLabel: "sourceLabel",
      content: "content",
      metadata: "metadata",
      isDeleted: "isDeleted",
      deletedAt: "deletedAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    ReviewScalarFieldEnum = {
      id: "id",
      userId: "userId",
      eventId: "eventId",
      rating: "rating",
      comment: "comment",
      parentId: "parentId",
      status: "status",
      createdAt: "createdAt"
    };
    ServiceScalarFieldEnum = {
      id: "id",
      title: "title",
      description: "description",
      icon: "icon",
      userId: "userId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    UserActivityScalarFieldEnum = {
      id: "id",
      viewerId: "viewerId",
      category: "category",
      eventid: "eventid",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    NullableJsonNullValueInput = {
      DbNull: DbNull2,
      JsonNull: JsonNull2
    };
    QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    NullsOrder = {
      first: "first",
      last: "last"
    };
    JsonNullValueFilter = {
      DbNull: DbNull2,
      JsonNull: JsonNull2,
      AnyNull: AnyNull2
    };
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// src/generated/prisma/enums.ts
var Role, UserStatus, EventType, PricingType, ParticipantStatus, PaymentStatus;
var init_enums = __esm({
  "src/generated/prisma/enums.ts"() {
    "use strict";
    Role = {
      ADMIN: "ADMIN",
      USER: "USER",
      MANAGER: "MANAGER"
    };
    UserStatus = {
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      BLOCKED: "BLOCKED",
      DELETED: "DELETED"
    };
    EventType = {
      PUBLIC: "PUBLIC",
      PRIVATE: "PRIVATE"
    };
    PricingType = {
      FREE: "FREE",
      PAID: "PAID"
    };
    ParticipantStatus = {
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      BANNED: "BANNED"
    };
    PaymentStatus = {
      PAID: "PAID",
      UNPAID: "UNPAID",
      FREE: "FREE"
    };
  }
});

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "src/generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// src/app/lib/prisma.ts
var prisma_exports = {};
__export(prisma_exports, {
  prisma: () => prisma
});
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, adapter, prisma;
var init_prisma = __esm({
  "src/app/lib/prisma.ts"() {
    "use strict";
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
});

// src/app.ts
import express6 from "express";

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
    "GITHUB_CLIENT_SECRET",
    "OPENROUTER_API_KEY",
    "OPENROUTER_EMBEDDING_MODEL",
    "OPENROUTER_LLM_MODEL",
    "DEESPEEK_OPEN_ROUTER_API_MODEL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "GEMINI_API_KEY"
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
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    RAG: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_EMBEDDING_MODEL: process.env.OPENROUTER_EMBEDDING_MODEL,
      OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL,
      DEESPEEK_OPEN_ROUTER_API_MODEL: process.env.DEESPEEK_OPEN_ROUTER_API_MODEL
    },
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
init_prisma();
init_enums();
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";

// src/app/utils/email.ts
import status3 from "http-status";
import nodemailer from "nodemailer";

// src/app/templates/htmlEmail.ts
function generateEmailTemplate(templateName, templateData) {
  const COLORS = {
    primary: "#0070f3",
    background: "#f9fafb",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#22223b",
    subtext: "#6b7280",
    danger: "#d90429"
  };
  switch (templateName) {
    case "otp":
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family: 'Segoe UI', Arial, sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background:${COLORS.card}; margin:2em auto; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid ${COLORS.border}; overflow: hidden;">
              <tr>
                <td style="padding: 2.5em 2em 1.2em 2em;">
                  <img src="https://planora.app/email-logo.png" alt="Planora Logo" height="36" style="display:block;margin-bottom:1.5em;">
                  <h2 style="margin-top:0;margin-bottom:.8em;font-size:2em;color:${COLORS.primary};font-weight:600;letter-spacing:-1px;">
                    Hello, ${templateData.name ? escapeStr(templateData.name) : "there"}!
                  </h2>
                  <p style="font-size:1.1em; margin: 0 0 1.6em 0; color: ${COLORS.text};">
                    Thank you for choosing Planora.<br/>
                    Please use the following One-Time Password (OTP) to proceed:
                  </p>
                  <div style="padding:1.2em 0;text-align:center;">
                    <span style="
                      font-size:2.6em;
                      font-weight:bold;
                      letter-spacing:0.24em;
                      color: ${COLORS.primary}; 
                      background: rgba(0,112,243,0.07);
                      border-radius: 8px;
                      display: inline-block;
                      min-width: 170px;">
                      ${templateData.otp ? escapeStr(templateData.otp) : "<em style='color:" + COLORS.danger + "'>Invalid code</em>"}
                    </span>
                  </div>
                  <p style="font-size:1em;color:${COLORS.subtext};margin:1.7em 0 0 0;">
                    <strong>Note:</strong> This code is valid for a limited time only. For your security, do not share this code with anyone.
                  </p>
                  <hr style="border: none; border-top: 1px solid ${COLORS.border}; margin:2em 0;">
                  <footer style="font-size:0.93em; color:${COLORS.subtext}; margin-bottom:0;">
                    Best regards,<br/>
                    <strong>The Planora Team</strong>
                  </footer>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family: 'Segoe UI', Arial, sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background:${COLORS.card}; margin:2em auto; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid ${COLORS.border}; overflow: hidden;">
              <tr>
                <td style="padding: 2.5em 2em 1.4em 2em;">
                  <img src="https://planora.app/email-logo.png" alt="Planora Logo" height="36" style="display:block;margin-bottom:1.5em;">
                  <h2 style="margin:0 0 .7em 0; color:${COLORS.primary};font-size:2em;font-weight:600;letter-spacing:-1px;">Email from Planora</h2>
                  <p style="font-size:1.1em; color: ${COLORS.text};">
                    This is a default email template.<br/>
                    Please contact our support team if you believe you received this in error.
                  </p>
                  <hr style="border:none; border-top:1px solid ${COLORS.border}; margin:2em 0;">
                  <footer style="font-size:0.93em; color:${COLORS.subtext};">
                    Thanks,<br/><strong>The Planora Team</strong>
                  </footer>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  }
}
function escapeStr(str) {
  return str.replace(/[&<>"'`]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  })[m]);
}

// src/app/utils/email.ts
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
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  socketTimeout: 3e4
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: `Planora <${envVars.EMAIL_SENDER.SMTP_USER}>`,
      to,
      subject,
      html: generateEmailTemplate(templateName, templateData),
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
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: `${envVars.FRONTEND_URL}`,
  trustedOrigins: [envVars.FRONTEND_URL],
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
        defaultValue: true
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
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
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
            await sendEmail({
              to: user.email,
              subject: "Verify your email address",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            await sendEmail({
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
      expiresIn: 10 * 60,
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
      redirectURI: `${envVars.FRONTEND_URL}/api/auth/callback/google`,
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
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    strategy: "jwt"
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
import path2 from "path";
import cors from "cors";

// src/app/middleware/globalErrorHandeller.ts
import status6 from "http-status";
init_client();

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data: data3 } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data: data3
  });
};

// src/app/errorHelper/handleerror.ts
import status5 from "http-status";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status4 from "http-status";
cloudinary.config({
  cloud_name: "dokqgr8fs",
  api_key: "935915381385685",
  api_secret: "R8e1RaC-ZiXpzNqbQOI7I-tzjz8",
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
import multer from "multer";
function errorHandler(err, req, res, next) {
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  let stack = void 0;
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === "LIMIT_FILE_SIZE" ? "\u09AB\u09BE\u0987\u09B2\u099F\u09BF \u0985\u09A8\u09C7\u0995 \u09AC\u09DC! \u09E7 \u09AE\u09C7\u0997\u09BE\u09AC\u09BE\u0987\u099F\u09C7\u09B0 \u09AC\u09C7\u09B6\u09BF \u09AB\u09BE\u0987\u09B2 \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964" : err.message,
      httpStatusCode: 400,
      data: { errorSources: [{ path: "file", message: err.message }] }
    });
  }
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
import { Router as Router11 } from "express";

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
init_enums();
init_prisma();
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
  const data3 = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      phone,
      image
    }
  });
  console.log(data3, "data");
  if (!data3.user) {
    throw new AppError_default(400, "User register failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data3.user.id,
    role: data3.user.role,
    name: data3.user.name,
    email: data3.user.email,
    status: data3.user.status,
    isDeleted: data3.user.isDeleted,
    emailVerified: data3.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data3.user.id,
    role: data3.user.role,
    name: data3.user.name,
    email: data3.user.email,
    status: data3.user.status,
    isDeleted: data3.user.isDeleted,
    emailVerified: data3.user.emailVerified
  });
  return {
    ...data3,
    token: data3.token,
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data3 = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data3.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status7.FORBIDDEN, "User is blocked");
  }
  if (data3.user.isDeleted || data3.user.status === UserStatus.DELETED) {
    throw new AppError_default(status7.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data3.user.id,
    role: data3.user.role,
    name: data3.user.name,
    email: data3.user.email,
    status: data3.user.status,
    isDeleted: data3.user.isDeleted,
    emailVerified: data3.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data3.user.id,
    role: data3.user.role,
    name: data3.user.name,
    email: data3.user.email,
    status: data3.user.status,
    isDeleted: data3.user.isDeleted,
    emailVerified: data3.user.emailVerified
  });
  return {
    ...data3,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  if (!user?.userId) {
    throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
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
    userId: session?.user.id,
    role: session?.user.role,
    name: session?.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session?.user.id,
    role: session?.user.role,
    name: session?.user.name
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
  if (!req.user?.userId) {
    throw new AppError_default(status8.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const data3 = await AuthService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User data retrieved successfully",
    data: data3
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

// src/app/modules/auth/auth.route.ts
init_enums();

// src/app/middleware/Auth.ts
import status9 from "http-status";
init_prisma();
var auth2 = (roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      let isAuthenticated = false;
      if (sessionToken) {
        const betterSession = await auth.api.getSession({ headers: req.headers });
        if (betterSession && betterSession.session) {
          const sessionExists = await prisma.session.findFirst({
            where: {
              token: betterSession.session.token,
              expiresAt: { gt: /* @__PURE__ */ new Date() }
            },
            include: { user: true }
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
            }
            if (user.status === "BLOCKED" || user.status === "DELETED") {
              throw new AppError_default(status9.UNAUTHORIZED, "Unauthorized access! User is not active.");
            }
            if (roles.length > 0 && !roles.includes(user.role)) {
              throw new AppError_default(status9.FORBIDDEN, "Forbidden access! No permission.");
            }
            req.user = { userId: user.id, role: user.role, email: user.email };
            isAuthenticated = true;
          }
        }
      }
      if (!isAuthenticated && accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (verifiedToken.success && verifiedToken.data) {
          const userData = verifiedToken.data;
          if (roles.length > 0 && !roles.includes(userData.role)) {
            throw new AppError_default(status9.FORBIDDEN, "Forbidden access! No permission.");
          }
          req.user = {
            userId: userData.userId,
            role: userData.role,
            email: userData.email
          };
          isAuthenticated = true;
        }
      }
      if (!isAuthenticated) {
        throw new AppError_default(status9.UNAUTHORIZED, "Unauthorized access! No valid session or token.");
      }
      next();
    } catch (error) {
      throw new AppError_default(error.statusCode || status9.BAD_REQUEST, error.message);
    }
  };
};
var Auth_default = auth2;

// src/app/config/multer.config.ts
import multer2 from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    console.log(file, "fisdf");
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `lumen/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      format: extension === "pdf" ? "pdf" : "webp",
      transformation: extension !== "pdf" ? [{ quality: "auto", fetch_format: "auto" }] : void 0
    };
  }
});
var multerUpload = multer2({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 6
  }
});

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", multerUpload.single("file"), validateRequest(createUserSchema), AuthController.UserRegister);
router.post("/login", AuthController.loginUser);
router.get("/me", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), AuthController.getMe);
router.post("/change-password", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), AuthController.changePassword);
router.post("/logout", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), AuthController.logoutUser);
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
init_enums();

// src/app/modules/event/event.controller.ts
import status11 from "http-status";

// src/app/modules/event/event.service.ts
import status10 from "http-status";
init_prisma();

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
    location,
    fee,
    category_name,
    images
  } = payload;
  if (!images) {
    throw new AppError_default(
      status10.BAD_REQUEST,
      "Image is required to create an event."
    );
  }
  console.log(images, "image");
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      priceType,
      category_name,
      location,
      images,
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
  const orConditions = [];
  if (search) {
    orConditions.push(
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        location: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
  }
  if (query) {
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
    if (query.date) {
      const dateRange = parseDateForPrisma(query.date);
      andConditions.push({ date: dateRange });
    }
    if (query.category_name) {
      orConditions.push({
        category_name: query.category_name
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
  if (orConditions.length > 0) {
    andConditions.push({ OR: orConditions });
  }
  console.log(orConditions, "or");
  console.log(andConditions, "and");
  const result = {};
  for (const status30 of statuses) {
    const events = await prisma.event.findMany({
      take: limit,
      skip,
      where: { status: status30, AND: andConditions, is_featured: is_featureddata },
      include: {
        reviews: {
          where: { rating: { gt: 0 } }
        },
        organizer: {
          select: {
            id: true,
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
    result[status30] = events.map((event) => {
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
var getEventsByRole = async (data3, userId, role, page, limit, skip, sortBy, sortOrder, search) => {
  const statuses = [
    "DRAFT",
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED"
  ];
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    );
    if (orConditions.length > 0) andConditions.push({ OR: orConditions });
  }
  if (data3.category_name) {
    andConditions.push({ category_name: data3.category_name });
  }
  if (data3.date) {
    const dateRange = parseDateForPrisma(data3.date);
    andConditions.push({ date: dateRange });
  }
  if (data3.createdAt) {
    const createdAtRange = parseDateForPrisma(data3.createdAt);
    andConditions.push({ createdAt: createdAtRange });
  }
  if (data3.fee) andConditions.push({ fee: { lte: Number(data3.fee) } });
  if (data3.visibility)
    andConditions.push({ visibility: data3.visibility });
  if (data3.priceType) andConditions.push({ priceType: data3.priceType });
  if (data3.is_featured !== void 0) {
    andConditions.push({
      is_featured: typeof data3.is_featured === "string" ? data3.is_featured === "true" : data3.is_featured
    });
  }
  if (data3.status) andConditions.push({ status: data3.status });
  if (data3.time) andConditions.push({ time: data3.time });
  if (role === "USER") {
    andConditions.push({ organizerId: userId });
  }
  const result = {};
  for (const status30 of statuses) {
    const events = await prisma.event.findMany({
      where: { status: status30, AND: andConditions },
      take: limit,
      skip,
      include: {
        reviews: { where: { rating: { gt: 0 } } },
        organizer: {
          select: { name: true, email: true, phone: true, image: true }
        }
      },
      orderBy: sortBy ? { [sortBy]: sortOrder } : { date: "desc" }
    });
    result[status30] = events.map((event) => {
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
var getSingleEvent = async (eventId, viewerId) => {
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
  await prisma.userActivity.upsert({
    where: {
      viewerId_eventid_category: {
        viewerId,
        eventid: event.id,
        category: event.category_name
      }
    },
    create: { viewerId, eventid: event.id, category: event.category_name },
    update: {
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
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
      location: payload.location,
      images: payload.images,
      status: payload.status,
      priceType: payload.priceType,
      category_name: payload.category_name,
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
  if (user.role !== "ADMIN" && user.role !== "MANAGER" && event.organizerId !== user.userId) {
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
  const limit = Number(options.limit) || 9;
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
  if (!req.user?.userId) {
    throw new AppError_default(
      status11.UNAUTHORIZED,
      "Unauthorized access. Please login first."
    );
  }
  const files = req.files;
  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images
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
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const { search } = req.query;
  const { is_featured } = req.query;
  const is_featureddata = is_featured ? req.query.is_featured === "true" ? true : req.query.is_featured === "false" ? false : void 0 : void 0;
  const events = await EventServices.getAllEvents(
    req.query,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    is_featureddata,
    search
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "All events fetched successfully",
    data: events
  });
});
var getEventsByRoleController = catchAsync(
  async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    if (!req.user?.userId || !req.user?.role) {
      throw new AppError_default(
        status11.UNAUTHORIZED,
        "Unauthorized access. Please login first."
      );
    }
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
  }
);
var getSingleEvent2 = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const viewerId = req.viewerId;
  const event = await EventServices.getSingleEvent(eventId, viewerId);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "single Event fetched successfully",
    data: event
  });
});
var getPaidAndFreeEvent = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const events = await EventServices.GetPaidAndFreeEvent(
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Paid and Free events fetched successfully",
    data: events
  });
});
var updateEvent2 = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  if (!req.user?.email) {
    throw new AppError_default(
      status11.UNAUTHORIZED,
      "Unauthorized access. Please login first."
    );
  }
  const user = req.user;
  const updatedEvent = await EventServices.updateEvent(
    eventId,
    req.body,
    user.email
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Event updated successfully",
    data: updatedEvent
  });
});
var DeletedEvent = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  if (!req.user?.userId) {
    throw new AppError_default(
      status11.UNAUTHORIZED,
      "Unauthorized access. Please login first."
    );
  }
  const deletedEvent = await EventServices.DeleteEvent(
    req.user,
    eventId
  );
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
var EventController = {
  createEvent: createEvent2,
  getAllEvents: getAllEvents2,
  getSingleEvent: getSingleEvent2,
  updateEvent: updateEvent2,
  DeletedEvent,
  getPaidAndFreeEvent,
  getEventsByRoleController,
  IsFeautured: IsFeautured2
};

// src/app/modules/event/event.validation.ts
init_enums();
import { z as z3 } from "zod";
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
  category_name: z3.string().min(1, "At least one category is required"),
  date: z3.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }).transform((val) => new Date(val).toISOString()),
  time: z3.string().min(1, "Time is required"),
  location: z3.string().min(3, "Location is required"),
  images: z3.array(z3.string()).default([]),
  visibility: z3.enum(EventType).default("PUBLIC"),
  priceType: z3.enum(PricingType).default("FREE"),
  fee: z3.coerce.number().optional(),
  status: EventStatusEnum.default("UPCOMING"),
  is_featured: z3.boolean().optional().default(false)
});
var UpdateEventSchema = z3.object({
  title: z3.string().optional(),
  description: z3.string().optional(),
  category_name: z3.string().optional(),
  date: z3.any().optional(),
  time: z3.string().optional(),
  location: z3.string().optional(),
  images: z3.any().optional(),
  visibility: z3.any().optional(),
  priceType: z3.any().optional(),
  fee: z3.coerce.number().optional(),
  status: z3.any().optional(),
  is_featured: z3.boolean().optional()
});

// src/app/lib/attracviewer.ts
import { v4 as uuidv4 } from "uuid";
var attachViewer = (req, res, next) => {
  const userId = req.user?.id;
  if (userId) {
    req.viewerId = userId;
    return next();
  }
  let guestId = req.cookies?.guestId;
  if (!guestId) {
    guestId = `guest_${uuidv4()}`;
    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: true,
      // HTTPS only in production
      sameSite: "lax",
      maxAge: 1e3 * 60 * 60 * 24 * 30
      // 30 days
    });
  }
  req.viewerId = guestId;
  next();
};

// src/app/modules/event/event.route.ts
var router2 = Router2();
router2.post(
  "/event",
  Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]),
  multerUpload.array("files"),
  validateRequest(CreateEventSchema),
  EventController.createEvent
);
router2.get("/event/isfeatured", EventController.IsFeautured);
router2.get("/events", EventController.getAllEvents);
router2.get("/category-events", EventController.getAllEvents);
router2.get("/my-events", Auth_default([Role.USER, Role.ADMIN, Role.MANAGER]), EventController.getEventsByRoleController);
router2.get("/events/paidandfree", EventController.getPaidAndFreeEvent);
router2.get("/event/:id", attachViewer, EventController.getSingleEvent);
router2.put("/event/:id", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), validateRequest(UpdateEventSchema), EventController.updateEvent);
router2.delete("/event/:id", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), EventController.DeletedEvent);
var EventRouters = router2;

// src/app/modules/Invitations/invitations.route.ts
import { Router as Router3 } from "express";
init_enums();

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
init_prisma();
var createInvitationService = async (inviterId, data3) => {
  const { inviteeId, message, eventId } = data3;
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
  if (user.role === "ADMIN" || user.role === "MANAGER") {
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
var getSingleInvitationService = async (id, viewerId) => {
  const result = await prisma.invitation.findUnique({
    where: { id },
    include: {
      event: { select: { id: true, title: true, date: true, location: true, category_name: true } },
      inviter: { select: { id: true, name: true, email: true, image: true } },
      invitee: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  await prisma.userActivity.upsert({
    where: {
      viewerId_eventid_category: {
        viewerId,
        eventid: result?.eventId,
        category: result?.event?.category_name
      }
    },
    create: { viewerId, eventid: result?.eventId, category: result?.event?.category_name },
    update: {
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  if (!result) {
    throw new AppError_default(404, "invitation not found");
  }
  return result;
};
var updateInvitationService = async (id, data3, userId) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  const userexist = await prisma.user.findUnique({ where: { id: userId } });
  if (invitation?.inviterId !== userId && (userexist?.role !== "ADMIN" && userexist?.role !== "MANAGER")) {
    throw new AppError_default(400, "you are not valid user for invitation, can update invitation just owner and admin and manager");
  }
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);
  const updateInv = await prisma.invitation.update({
    where: { id },
    data: data3,
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
  if (invitation?.inviterId !== userId && (userexist?.role !== "ADMIN" && userexist?.role !== "MANAGER")) {
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
  const viewerId = req.viewerId;
  const result = await invitationsServices.getSingleInvitationService(id, viewerId);
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
router3.post("/invitation", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), InvitationController.CreateInvitation);
router3.get("/invitation/user", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), attachViewer, InvitationController.getInvitationsService);
router3.get("/invitation/:id", InvitationController.GetSingleInvitationController);
router3.put("/invitation/:id", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), validateRequest(updateInvitationSchema), InvitationController.updateInvitation);
router3.delete("/invitation/:id", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), InvitationController.deleteInvitation);
var InvitationsRouters = router3;

// src/app/modules/Participants/participants.route.ts
import express from "express";

// src/app/modules/Participants/participants.service.ts
import { v6 as uuidv6 } from "uuid";
init_prisma();

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/modules/Participants/participants.service.ts
init_enums();
import status13 from "http-status";
var createParticipantService = async (userId, eventId, data3) => {
  const existEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      organizerId: userId
    }
  });
  if (existEvent) {
    throw new AppError_default(400, "This is your own event. No further action is needed!");
  }
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId }
  });
  if (existing?.status === "BANNED") {
    throw new AppError_default(status13.FORBIDDEN, "You have been banned from participating in this event.");
  }
  if (existing?.paymentStatus === PaymentStatus.UNPAID) {
    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({
        where: { participantId: existing.id }
      });
      await tx.participant.delete({
        where: { id: existing.id }
      });
    });
  }
  if (existing) {
    const refreshed = await prisma.participant.findFirst({
      where: { userId, eventId }
    });
    if (refreshed) {
      throw new AppError_default(409, "User already joined");
    }
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      fee: true,
      category_name: true,
      date: true,
      location: true,
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
        paymentId: paymentData.id,
        userId
      },
      payment_intent_data: {
        metadata: {
          participantId: participantData.id,
          paymentId: paymentData.id
        }
      },
      success_url: `${envVars.FRONTEND_URL}/payment/${eventId}?participantId=${participantData.id}&paymentId=${paymentData.id}`,
      cancel_url: `${envVars.FRONTEND_URL}/payment/${eventId}?participantId=${participantData.id}&paymentId=${paymentData.id}`
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
  if (user.role === "ADMIN" || user.role === "MANAGER") {
    const result = await prisma.participant.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        "joinedAt": "desc"
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        event: { select: { id: true, title: true, date: true, location: true } }
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
      where: { ...where, eventId: { in: eventIds } },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        event: { select: { id: true, title: true, date: true, location: true } }
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
      payment: { select: { id: true, amount: true, status: true, transactionId: true, user: true, eventId: true } },
      event: { select: { id: true, title: true, date: true, location: true, priceType: true } }
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
          location: true,
          images: true,
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
      event: { select: { id: true, title: true, date: true, location: true } }
    }
  });
};
var UpdateParticipantService = async (id, data3, userId) => {
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
    updateData.status = data3.status;
  }
  if (user.role === "ADMIN" || user.role === "MANAGER") {
    updateData.status = data3.status;
    updateData.paymentStatus = data3.paymentStatus;
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
  const existEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      organizerId: userId
    }
  });
  if (existEvent) {
    throw new AppError_default(400, "This is your own event. No further action is needed!");
  }
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
          select: { id: true, title: true, date: true, location: true, fee: true }
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
      payment_intent_data: {
        metadata: {
          participantId: participantData.id,
          paymentId: paymentData.id
        }
      },
      success_url: `${envVars.FRONTEND_URL}/payment/${eventId}?participantId=${participantData.id}&paymentId=${paymentData.id}`,
      cancel_url: `${envVars.FRONTEND_URL}/payment/${eventId}?participantId=${participantData.id}&paymentId=${paymentData.id}`
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
init_enums();
var router4 = express.Router();
router4.get("/participant/event/:id/own-payment", Auth_default([Role.USER, Role.ADMIN, Role.MANAGER]), ParticipantControllers.getOwnPayment);
router4.get("/participant/request/event", Auth_default([Role.USER]), ParticipantControllers.ParticipantOwnRequestEvent);
router4.delete("/participant/request/event/:id", Auth_default([Role.USER]), ParticipantControllers.deleteEventRequestJoinData);
router4.post("/participant/event/:id", Auth_default([Role.USER]), ParticipantControllers.createParticipantController);
router4.get("/participants", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), ParticipantControllers.getAllParticipants);
router4.get("/participant/:id", ParticipantControllers.getSingleParticipant);
router4.put("/participant/:id", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), ParticipantControllers.updateParticipant);
router4.delete("/participant/:id", Auth_default([Role.ADMIN, Role.MANAGER]), ParticipantControllers.deleteParticipant);
router4.post("/participant-with-pay-later/:id", Auth_default([Role.USER]), ParticipantControllers.ParticipantCreateWithPayLater);
router4.post("/initiate-payment/:id", Auth_default([Role.USER]), ParticipantControllers.initiatePayment);
var ParticipantRoutes = router4;

// src/app/modules/reviews/reviews.route.ts
import { Router as Router4 } from "express";
init_enums();

// src/app/modules/reviews/reviews.service.ts
init_prisma();
var CreateReviews = async (userId, eventId, data3) => {
  const existingmeal = await prisma.event.findUnique({
    where: {
      id: eventId
    }
  });
  if (!existingmeal) {
    throw new AppError_default(404, "Event not found for this id");
  }
  const participant = await prisma.participant.findFirst({
    where: {
      userId,
      eventId,
      status: "APPROVED"
    },
    select: {
      id: true
    }
  });
  if (!participant) {
    throw new AppError_default(
      403,
      "You cannot submit a review because you have not joined this event yet."
    );
  }
  if (data3.rating >= 6) {
    throw new AppError_default(400, "rating must be between 1 and 5");
  }
  const result = await prisma.review.create({
    data: {
      userId,
      eventId,
      ...data3
    }
  });
  return result;
};
var updateReview = async (reviewId, data3, userid) => {
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
      ...data3
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
  if (userid !== review.userId && (existUser?.role !== "ADMIN" && existUser?.role !== "MANAGER")) {
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
var getReviewsByRole = async (role, userId, page = 1, limit = 10, skip = 0, data3, sortBy = "createdAt", sortOrder = "desc") => {
  const andConditions = [];
  if (data3.parentId !== void 0) {
    andConditions.push({
      parentId: data3.parentId
    });
  }
  if (data3.status) {
    andConditions.push({
      status: data3.status
    });
  }
  if (typeof data3.rating === "number") {
    andConditions.push({
      rating: Number(data3.rating)
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
            location: true,
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
var moderateReview = async (id, data3) => {
  const { status: status30 } = data3;
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
  if (reviewData.status === data3.status) {
    throw new AppError_default(409, `Your provided status (${data3.status}) is already up to date.`);
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: status30
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
router5.delete("/review/:reviewid", Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]), ReviewsControllers.deleteReview);
router5.put("/review/:reviewid/moderate", Auth_default([Role.MANAGER, Role.ADMIN]), ReviewsControllers.moderateReview);
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

// src/generated/prisma/browser.ts
init_enums();
init_enums();

// src/app/modules/stats/stats.controller.ts
import status17 from "http-status";

// src/app/modules/stats/stats.service.ts
init_enums();
import status16 from "http-status";
init_prisma();
var getDashboardStatsData = async (user) => {
  let statsData;
  switch (user.role) {
    case Role.ADMIN:
      statsData = getAdminDashboardStats();
      break;
    case Role.MANAGER:
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
    const [
      eventCount,
      userCount,
      participantCount,
      invitationCount,
      paymentCount
    ] = counts;
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;
    const [
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      draftEvetn,
      ongoingEvent
    ] = await Promise.all([
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
var getPublicStatsData = async () => {
  try {
    const totalEvents = await prisma.event.count();
    const totalUsers = await prisma.user.count();
    const totalManagers = await prisma.user.count({
      where: { role: "MANAGER" }
    });
    const totalAdmins = await prisma.user.count({
      where: { role: "ADMIN" }
    });
    const totalParticipants = await prisma.participant.count();
    const totalReviews = await prisma.review?.count?.() ?? 0;
    const totalNewsletters = await prisma.newsletter?.count?.() ?? 0;
    return {
      totalEvents,
      totalUsers,
      totalManagers,
      totalAdmins,
      totalParticipants,
      totalReviews,
      totalNewsletters
    };
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    throw new Error("Could not fetch public stats");
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
    const [
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      draftEvent,
      ongoingEvent
    ] = await Promise.all([
      prisma.participant.count({
        where: { userId, event: { status: "UPCOMING" } }
      }),
      prisma.participant.count({
        where: { userId, event: { status: "COMPLETED" } }
      }),
      prisma.participant.count({
        where: { userId, event: { status: "CANCELLED" } }
      }),
      prisma.participant.count({
        where: { userId, event: { status: "DRAFT" } }
      }),
      prisma.participant.count({
        where: { userId, event: { status: "ONGOING" } }
      })
    ]);
    const [privateEvent, publicEvent] = await Promise.all([
      prisma.event.count({
        where: { organizerId: userId, visibility: "PRIVATE" }
      }),
      prisma.event.count({
        where: { organizerId: userId, visibility: "PUBLIC" }
      })
    ]);
    const [freeEvent, paidEvent] = await Promise.all([
      prisma.event.count({ where: { organizerId: userId, priceType: "FREE" } }),
      prisma.event.count({ where: { organizerId: userId, priceType: "PAID" } })
    ]);
    const payments = await prisma.payment.findMany({
      where: { userId, status: PaymentStatus.PAID },
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
var statsService = { getDashboardStatsData, getPublicStatsData };

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
var getPublicStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await statsService.getPublicStatsData();
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2,
  getPublicStatsData: getPublicStatsData2
};

// src/app/modules/stats/stats.route.ts
var router6 = express2.Router();
router6.get(
  "/stats",
  Auth_default([Role.USER, Role.ADMIN, Role.MANAGER]),
  StatsController.getDashboardStatsData
);
router6.get(
  "/publicstats",
  StatsController.getPublicStatsData
);
var StatsRoutes = router6;

// src/app/modules/user/user.route.ts
init_enums();
import { Router as Router5 } from "express";

// src/app/modules/user/user.service.ts
init_prisma();
var UpdateUserProfile = async (data3, userid) => {
  if (!data3 || Object.keys(data3).length === 0) {
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
    name: data3.name,
    image: data3.image,
    bgimage: data3.bgimage,
    phone: data3.phone,
    isActive: data3.isActive,
    ...isUserRole ? {} : { email: data3.email }
  };
  const updatedUser = await prisma.user.update({
    where: { id: userid },
    data: updateData
  });
  return updatedUser;
};
var GetAllUsers = async (data3, page, limit, skip, sortBy, sortOrder, isemailVerified) => {
  const andCondition = [];
  if (typeof data3.email == "string") {
    andCondition.push({
      email: data3?.email
    });
  }
  if (typeof data3?.phone == "string") {
    andCondition.push({
      phone: data3?.phone
    });
  }
  if (typeof data3?.name == "string") {
    andCondition.push({
      name: data3?.name
    });
  }
  if (typeof data3?.role == "string") {
    andCondition.push({ role: data3?.role });
  }
  if (typeof data3?.status == "string") {
    andCondition.push({ status: data3?.status });
  }
  if (typeof data3.isactivequery == "boolean") {
    andCondition.push({ isActive: data3.isactivequery });
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
      page: data3.page,
      limit: data3.limit,
      totalpage: Math.ceil(totalusers / data3.limit) || 1
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
var UpdateUser = async (id, data3) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  if (userData.role == data3.role) {
    throw new AppError_default(409, `your status(${data3.role}) already up to date`);
  }
  if (userData.status === data3.status) {
    throw new AppError_default(409, `your status(${data3.status}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: data3.role,
      status: data3.status,
      email: data3.email
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
  role: z6.enum(["ADMIN", "USER", "MANAGER"]).optional(),
  status: z6.enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"]).optional(),
  email: z6.string().optional()
}).strict();

// src/app/modules/user/user.route.ts
var router7 = Router5();
router7.get("/admin/users", Auth_default([Role.ADMIN, Role.MANAGER]), UserController.GetAllUsers);
router7.delete("/profile/own", Auth_default([Role.USER]), UserController.OwnProfileDelete);
router7.get(
  "/profile/:id",
  UserController.GetSingleUser
);
router7.put(
  "/profile/update",
  Auth_default([Role.USER, Role.ADMIN, Role.MANAGER]),
  validateRequest(UpdateuserProfileData),
  UserController.UpdateUserProfile
);
router7.put("/admin/profile/:id", Auth_default([Role.ADMIN, Role.MANAGER]), validateRequest(UpdateUserCommonData), UserController.UpdateUser);
router7.delete("/profile/own/delete", Auth_default([Role.USER, Role.ADMIN, Role.MANAGER]), UserController.OwnProfileDelete);
router7.delete("/admin/profile/:id", Auth_default([Role.ADMIN]), UserController.DeleteUserProfile);
var UsersRoutes = router7;

// src/app/modules/notification/notification.route.ts
import express3 from "express";

// src/app/modules/notification/notification.controller.ts
import status19 from "http-status";

// src/app/modules/notification/notification.service.ts
init_prisma();
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
  if (!req.user?.userId) {
    throw new AppError_default(status19.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
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
init_enums();
var router8 = express3.Router();
router8.get("/notifications", Auth_default([Role.USER]), NotificationController.getUserNotificationsController);
var NotificationRoutes = router8;

// src/app/modules/payment/payment.route.ts
import express4 from "express";
init_enums();

// src/app/modules/payment/payment.controller.ts
import status20 from "http-status";

// src/app/modules/payment/payment.service.ts
init_prisma();
init_enums();
var deleteParticipantAndPayment = async (participantId, paymentId) => {
  if (!participantId || !paymentId) {
    console.error("Missing participantId or paymentId in session metadata");
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { id: paymentId }
    });
    await tx.participant.deleteMany({
      where: { id: participantId }
    });
  });
  console.log(
    `Payment failed. Deleted participant ${participantId} and payment ${paymentId}`
  );
};
var deleteParticipantAndPaymentByIds = async (participantId, paymentId) => {
  await deleteParticipantAndPayment(participantId, paymentId);
  return { message: "Payment canceled. Payment and participant deleted." };
};
var cleanupAllUnpaidPayments = async () => {
  const unpaidPayments = await prisma.payment.findMany({
    where: { status: PaymentStatus.UNPAID },
    select: { id: true, participantId: true }
  });
  if (!unpaidPayments.length) {
    return { deletedPayments: 0, deletedParticipants: 0 };
  }
  const paymentIds = unpaidPayments.map((p) => p.id);
  const participantIds = unpaidPayments.map((p) => p.participantId);
  const [deletedPayments, deletedParticipants] = await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: paymentIds } }
    }),
    prisma.participant.deleteMany({
      where: { id: { in: participantIds } }
    })
  ]);
  return {
    deletedPayments: deletedPayments.count,
    deletedParticipants: deletedParticipants.count
  };
};
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
      const userId = session.metadata?.userId;
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
      if (session.payment_status !== "paid") {
        await deleteParticipantAndPayment(participantId, paymentId);
        break;
      }
      await prisma.$transaction(async (tx) => {
        await tx.participant.update({
          where: {
            id: participantId
          },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session
          }
        });
        await tx.user.update({
          where: {
            id: userId
          },
          data: {
            promptCount: {
              increment: 10
            },
            promptResetAt: null,
            plan: "PREMIUM"
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
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} succeeded.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "payment_intent.canceled": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var getAllPaymentsService = async (userId, page, limit, skip, sortBy, sortOrder, query) => {
  await cleanupAllUnpaidPayments();
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
    throw new AppError_default(404, "Payment not found");
  }
  if (!payment.participant) {
    throw new AppError_default(404, "Associated participant not found");
  }
  if (newStatus.toUpperCase() === PaymentStatus.UNPAID) {
    const [deletedPayment, deletedParticipant] = await prisma.$transaction([
      prisma.payment.delete({
        where: { id: paymentId }
      }),
      prisma.participant.delete({
        where: { id: payment.participant.id }
      })
    ]);
    return {
      payment: deletedPayment,
      participant: deletedParticipant,
      message: "Payment is UNPAID, so payment and participant were deleted"
    };
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
  const [deletedPayment, deletedParticipant] = await prisma.$transaction([
    prisma.payment.delete({
      where: { id: paymentId }
    }),
    prisma.participant.delete({
      where: { id: payment.participant.id }
    })
  ]);
  return {
    payment: deletedPayment,
    participant: deletedParticipant
  };
};
var PaymentService = {
  handlerStripeWebhookEvent,
  getAllPaymentsService,
  updatePaymentStatusWithParticipantCheck,
  deletePayment,
  deleteParticipantAndPaymentByIds
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
var handleStripeCancelRedirect = catchAsync(async (req, res) => {
  const participantId = req.query.participantId;
  const paymentId = req.query.paymentId;
  if (!participantId || !paymentId) {
    return res.redirect(`${envVars.FRONTEND_URL}/payment/payment-failed`);
  }
  await PaymentService.deleteParticipantAndPaymentByIds(participantId, paymentId);
  return res.redirect(`${envVars.FRONTEND_URL}/payment/payment-failed`);
});
var PaymentController = {
  handleStripeWebhookEvent,
  getAllPayment,
  updatePaymentStatus,
  deletePayment: deletePayment2,
  handleStripeCancelRedirect
};

// src/app/modules/payment/payment.route.ts
var router9 = express4.Router();
router9.get("/payments/stripe-cancel", PaymentController.handleStripeCancelRedirect);
router9.get("/payments/verify-success", async (req, res) => {
  try {
    const { paymentId, participantId } = req.query;
    if (!paymentId || !participantId) {
      return res.status(400).json({
        success: false,
        message: "paymentId and participantId are required"
      });
    }
    const payment = await (init_prisma(), __toCommonJS(prisma_exports)).prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        participant: true,
        event: true
      }
    });
    if (!payment || payment.participantId !== participantId) {
      return res.status(404).json({
        success: false,
        message: "Payment not found with provided paymentId and participantId"
      });
    }
    if (payment.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment verified",
        data: {
          eventTitle: payment.event?.title || null,
          amount: payment.amount,
          status: payment.status,
          transactionId: payment.transactionId,
          participantId: payment.participantId,
          paymentId: payment.id
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Payment is not PAID (current status: ${payment.status})`
      });
    }
  } catch (error) {
    console.error("Error in payment verify-success endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification"
    });
  }
});
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

// src/app/modules/blog/blog.route.ts
import { Router as Router6 } from "express";
init_enums();

// src/app/modules/blog/blog.validation.ts
import { z as z7 } from "zod";
var createBlogSchema = z7.object({
  title: z7.string().min(1, { message: "Title is required." }),
  content: z7.string().min(1, { message: "Content is required." }),
  images: z7.array(z7.string()).default([]),
  eventId: z7.string()
});
var updateBlogSchema = z7.object({
  title: z7.string().min(1, { message: "Title cannot be empty." }).optional(),
  content: z7.string().min(1, { message: "Content cannot be empty." }).optional(),
  images: z7.array(z7.string()).default([]),
  authorId: z7.string().min(1, { message: "Author ID cannot be empty." }).optional(),
  eventId: z7.string().optional().nullable()
}).refine(
  (data3) => Object.keys(data3).length > 0,
  { message: "At least one field must be provided to update the blog." }
);

// src/app/modules/blog/blog.controller.ts
import status22 from "http-status";

// src/app/modules/blog/blog.service.ts
import status21 from "http-status";
init_prisma();
var createBlog = async (user, payload) => {
  const { title, content, images, eventId } = payload;
  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new AppError_default(status21.BAD_REQUEST, "At least one image is required to create a blog.");
  }
  if (!eventId) {
    throw new AppError_default(status21.BAD_REQUEST, "Event ID is required to create a blog.");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status21.BAD_REQUEST, "The provided eventId does not correspond to any existing event.");
  }
  if (!title || !content || !images) {
    throw new AppError_default(status21.BAD_REQUEST, "Title, content, and image are required to create a blog.");
  }
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      images,
      authorId: user.userId,
      eventId: event.id
    }
  });
  return blog;
};
var getAllBlogs = async (query, page, limit, skip, sortBy, sortOrder, search) => {
  console.log(query?.createdAt);
  const andConditions = [];
  const orConditions = [];
  if (query) {
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
  }
  if (search) {
    orConditions.push(
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        content: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
  }
  if (orConditions.length > 0) {
    andConditions.push({ OR: orConditions });
  }
  console.log(andConditions, "andcondition");
  const blogs = await prisma.blog.findMany({
    where: { AND: andConditions },
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      event: true
    }
  });
  const total = await prisma.blog.count({ where: { AND: andConditions } });
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: 9,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleBlog = async (blogId, viewerId) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      event: true
    }
  });
  await prisma.userActivity.upsert({
    where: {
      viewerId_eventid_category: {
        viewerId,
        eventid: blog?.eventId,
        category: blog?.event?.category_name
      }
    },
    create: { viewerId, eventid: blog?.eventId, category: blog?.event?.category_name },
    update: {
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  return blog;
};
var updateBlog = async (blogId, payload, user) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  if (user.role !== "ADMIN" && blog.authorId !== user.userId) {
    throw new AppError_default(403, "You are not authorized to update this blog");
  }
  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data: {
      content: payload.content,
      images: payload.images,
      title: payload.title
    }
  });
  return updatedBlog;
};
var deleteBlog = async (user, blogId) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId }
  });
  if (!blog) {
    throw new AppError_default(404, "Blog not found");
  }
  if (user.role !== "ADMIN" && blog.authorId !== user.userId) {
    throw new AppError_default(403, "You are not authorized to delete this blog");
  }
  const deletedBlog = await prisma.blog.delete({
    where: { id: blogId }
  });
  return deletedBlog;
};
var getBlogsByAuthor = async (authorId, page, limit, skip, sortBy = "createdAt", sortOrder = "desc") => {
  const where = { authorId };
  const blogs = await prisma.blog.findMany({
    where,
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  const total = await prisma.blog.count({ where });
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: limit || blogs.length,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var BlogServices = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor
};

// src/app/modules/blog/blog.controller.ts
var createBlog2 = catchAsync(async (req, res) => {
  if (!req.user?.userId) {
    throw new AppError_default(status22.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const files = req.files;
  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images
  };
  const user = req.user;
  const result = await BlogServices.createBlog(user, payload);
  sendResponse(res, {
    httpStatusCode: status22.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result
  });
});
var getAllBlogs2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const { search } = req.query;
  const result = await BlogServices.getAllBlogs(req.query, page, limit, skip, sortBy, sortOrder, search);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Blogs fetched successfully",
    data: result
  });
});
var getSingleBlog2 = catchAsync(async (req, res) => {
  const viewerId = req.viewerId;
  const { id } = req.params;
  const result = await BlogServices.getSingleBlog(id, viewerId);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result
  });
});
var updateBlog2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.updateBlog(id, req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Blog updated successfully",
    data: result
  });
});
var deleteBlog2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlog(req.user, id);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result
  });
});
var BlogController = {
  createBlog: createBlog2,
  getAllBlogs: getAllBlogs2,
  getSingleBlog: getSingleBlog2,
  updateBlog: updateBlog2,
  deleteBlog: deleteBlog2
};

// src/app/modules/blog/blog.route.ts
var router10 = Router6();
router10.post(
  "/blog",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  multerUpload.array("files"),
  validateRequest(createBlogSchema),
  BlogController.createBlog
);
router10.get(
  "/blogs",
  BlogController.getAllBlogs
);
router10.get(
  "/blog/:id",
  BlogController.getSingleBlog
);
router10.put(
  "/blog/:id",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  validateRequest(updateBlogSchema),
  BlogController.updateBlog
);
router10.delete(
  "/blog/:id",
  Auth_default([Role.ADMIN]),
  BlogController.deleteBlog
);
var BlogRouters = router10;

// src/app/modules/highlight/highlight.route.ts
import { Router as Router7 } from "express";
init_enums();

// src/app/modules/highlight/highlight.validation.ts
import { z as z8 } from "zod";
var createHighlightSchema = z8.object({
  title: z8.string().min(1, { message: "Title is required." }),
  description: z8.string().min(1, { message: "Description is required." }),
  image: z8.string().url({ message: "Image must be a valid URL." }).optional().nullable()
});
var updateHighlightSchema = z8.object({
  title: z8.string().optional(),
  description: z8.string().optional(),
  image: z8.any().optional()
});

// src/app/modules/highlight/highlight.controller.ts
import status24 from "http-status";

// src/app/modules/highlight/highlight.service.ts
import status23 from "http-status";
init_prisma();
var createHighlight = async (user, payload) => {
  const { title, description, image } = payload;
  if (!title || !description) {
    throw new AppError_default(status23.BAD_REQUEST, "Title and description are required to create a highlight.");
  }
  const highlight = await prisma.highlight.create({
    data: {
      title,
      description,
      image: image ?? null,
      userId: user.userId
    }
  });
  return highlight;
};
var getAllHighlights = async (query, page, limit, skip, sortBy = "createdAt", sortOrder = "desc", search) => {
  const where = {};
  if (query?.title) {
    where.title = { contains: query.title, mode: "insensitive" };
  }
  if (query?.description) {
    where.description = { contains: query.description, mode: "insensitive" };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  const highlights = await prisma.highlight.findMany({
    where,
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  const total = await prisma.highlight.count({ where });
  return {
    data: highlights,
    pagination: {
      total,
      page: page || 1,
      limit: limit || highlights.length,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleHighlight = async (highlightId) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  if (!highlight) {
    throw new AppError_default(status23.NOT_FOUND, "Highlight not found");
  }
  return highlight;
};
var updateHighlight = async (highlightId, payload, user) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId }
  });
  if (!highlight) {
    throw new AppError_default(status23.NOT_FOUND, "Highlight not found");
  }
  if (user.role !== "ADMIN" && highlight.userId !== user.userId) {
    throw new AppError_default(status23.FORBIDDEN, "You are not authorized to update this highlight");
  }
  const updatedHighlight = await prisma.highlight.update({
    where: { id: highlightId },
    data: payload
  });
  return updatedHighlight;
};
var deleteHighlight = async (user, highlightId) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId }
  });
  if (!highlight) {
    throw new AppError_default(status23.NOT_FOUND, "Highlight not found");
  }
  if (user.role !== "ADMIN" && highlight.userId !== user.userId) {
    throw new AppError_default(status23.FORBIDDEN, "You are not authorized to delete this highlight");
  }
  const deletedHighlight = await prisma.highlight.delete({
    where: { id: highlightId }
  });
  return deletedHighlight;
};
var HighlightServices = {
  createHighlight,
  getAllHighlights,
  getSingleHighlight,
  updateHighlight,
  deleteHighlight
};

// src/app/modules/highlight/highlight.controller.ts
var createHighlight2 = catchAsync(async (req, res) => {
  if (!req.user?.userId) {
    throw new AppError_default(status24.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const user = req.user;
  const result = await HighlightServices.createHighlight(user, payload);
  sendResponse(res, {
    httpStatusCode: status24.CREATED,
    success: true,
    message: "Highlight created successfully",
    data: result
  });
});
var getAllHighlights2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await HighlightServices.getAllHighlights({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    filters: req.query
  });
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Highlights fetched successfully",
    data: result
  });
});
var getSingleHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HighlightServices.getSingleHighlight(id);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Highlight fetched successfully",
    data: result
  });
});
var updateHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body.title !== void 0 && { title: req.body.title },
    ...req.body.description !== void 0 && { description: req.body.description },
    ...req.body.image !== void 0 && { image: req.body.image }
  };
  const result = await HighlightServices.updateHighlight(id, payload, req.user);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Highlight updated successfully",
    data: result
  });
});
var deleteHighlight2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HighlightServices.deleteHighlight(req.user, id);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Highlight deleted successfully",
    data: result
  });
});
var HighlightController = {
  createHighlight: createHighlight2,
  getAllHighlights: getAllHighlights2,
  getSingleHighlight: getSingleHighlight2,
  updateHighlight: updateHighlight2,
  deleteHighlight: deleteHighlight2
};

// src/app/modules/highlight/highlight.route.ts
var router11 = Router7();
router11.post(
  "/highlight",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  multerUpload.single("file"),
  validateRequest(createHighlightSchema),
  HighlightController.createHighlight
);
router11.get(
  "/highlights",
  HighlightController.getAllHighlights
);
router11.get(
  "/highlight/:id",
  HighlightController.getSingleHighlight
);
router11.put(
  "/highlight/:id",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  validateRequest(updateHighlightSchema),
  HighlightController.updateHighlight
);
router11.delete(
  "/highlight/:id",
  Auth_default([Role.ADMIN]),
  HighlightController.deleteHighlight
);
var HighlightRouters = router11;

// src/app/modules/rag/rag.route.ts
import { Router as Router8 } from "express";

// src/app/modules/rag/rag.service.ts
init_client();
init_prisma();

// src/app/modules/rag/embedding.service.ts
var EmbeddingService = class {
  apikey;
  apiUrl = "https://openrouter.ai/api/v1";
  embeddingModel;
  constructor() {
    this.apikey = envVars.RAG.OPENROUTER_API_KEY;
    this.embeddingModel = envVars.RAG.OPENROUTER_EMBEDDING_MODEL;
    if (!this.apikey) {
      throw new Error("OPENROUTER_API_KEY is not set in .env");
    }
  }
  async generateEmbedding(text) {
    try {
      const response = await fetch(`${this.apiUrl}/embeddings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: text,
          model: this.embeddingModel
        })
      });
      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }
      const data3 = await response.json();
      if (!data3.data || data3.data.length == 0) {
        throw new Error("No embedding data returned");
      }
      return data3.data[0].embedding;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// src/app/modules/rag/Indexing.service.ts
init_client();
init_prisma();
var toVectorLiteral = (vector) => `[${vector.join(",")}]`;
var IndexingService = class {
  embeddingService;
  constructor() {
    this.embeddingService = new EmbeddingService();
  }
  async indexDocument(chunkKey, sourceType, sourceId, content, sourceLabel, metadata) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw(prismaNamespace_exports.sql`
        INSERT INTO "document_embeddings"
        (
            "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
            ${prismaNamespace_exports.raw("gen_random_uuid()")},
            ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})} :: jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
            "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLabel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
        `);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async indexEventsData() {
    try {
      console.log("Fetching events data for indexing...");
      const events = await prisma.event.findMany({
        include: {
          reviews: true,
          blogs: true,
          participants: true,
          payments: true,
          category: true,
          invitations: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });
      let indexedCount = 0;
      for (const event of events) {
        const blogsText = event.blogs.map(
          (blog) => `
            
  Blog Title:
  ${blog.title}
  
  Blog Content:
  ${blog.content}
  
  Published At:
  ${blog.createdAt}
  `
        ).join("\n");
        const reviewsText = event.reviews.map(
          (review) => `
  Rating:
  ${review.rating}/5
  
  Comment:
  ${review.comment || "No comment"}
  `
        ).join("\n");
        const participantsText = `
  Total Participants:
  ${event.participants.length}
  `;
        const invitationsText = `
  Total Invitations:
  ${event.invitations.length}
  `;
        const content = `
        owner name : sujon biswas
        id:${event.id}
        
  Event Title:
  ${event.title}
  
  Description:
  ${event.description}
  
  Category:
  ${event.category_name}
  
  Location:
  ${event.location}
  
  Event Date:
  ${event.date}
  
  Event Time:
  ${event.time}
  
  Visibility:
  ${event.visibility}
  
  Price Type:
  ${event.priceType}
  
  Ticket Fee:
  $${event.fee}
  
  Status:
  ${event.status}
  
  Featured Event:
  ${event.is_featured ? "Yes" : "No"}
  
  Organizer Information:
  Organizer Name: ${event.organizer?.name || "Unknown"}
  Organizer Email: ${event.organizer?.email || "Unknown"}
  Organizer Role: ${event.organizer?.role || "USER"}
  
  ${participantsText}
  
  ${invitationsText}
  
  Event Reviews:
  ${reviewsText || "No reviews yet."}
  
  Related Blogs:
  ${blogsText || "No blogs available."}
  `;
        const metadata = {
          eventId: event.id,
          title: event.title,
          category: event.category_name,
          location: event.location,
          visibility: event.visibility,
          priceType: event.priceType,
          fee: event.fee,
          status: event.status,
          featured: event.is_featured,
          totalReviews: event.reviews.length,
          totalBlogs: event.blogs.length,
          totalParticipants: event.participants.length,
          totalInvitations: event.invitations.length,
          organizerRole: event.organizer?.role
        };
        const chunkKey = `event-${event.id}`;
        await this.indexDocument(
          chunkKey,
          "EVENT",
          event.id,
          content,
          event.title,
          metadata
        );
        indexedCount++;
      }
      console.log(`Successfully indexed ${indexedCount} events.`);
      return {
        success: true,
        message: `Successfully indexed ${indexedCount} events.`,
        indexedCount
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// src/app/modules/rag/llm.service.ts
init_prisma();
import { OpenRouter } from "@openrouter/sdk";
var openRouter = new OpenRouter({
  apiKey: envVars.RAG.OPENROUTER_API_KEY
});
var keyInfo = await openRouter.apiKeys.getCurrentKeyMetadata();
var data = keyInfo.data;
if (data?.isFreeTier) {
  console.log("Free tier user");
}
if (data?.limitRemaining === 0) {
  throw new AppError_default(
    429,
    "Daily AI limit exceeded"
  );
}
if (data?.expiresAt) {
  console.log("Key expires at:", data.expiresAt);
}
var LLMService = class {
  apiKey;
  apiUrl = "https://openrouter.ai/api/v1";
  model;
  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY;
    this.model = envVars.RAG.OPENROUTER_LLM_MODEL || envVars.RAG.DEESPEEK_OPEN_ROUTER_API_MODEL;
    if (!this.apiKey) {
      throw new Error("OpenRouter api key is missing...");
    }
  }
  async generateResponse(prompt, context = [], asJson = false) {
    try {
      let fullPrompt = context.length > 0 ? `Context information:
${context.join("\n\n")}

Question: ${prompt}

Answer based on the context above.` : prompt;
      if (asJson) {
        fullPrompt += `
        
AI Chat Assistant: Return ONLY a valid JSON object matching this structure: {"event": [{"title": "event title", "description": "event description", "id": "id"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }
      const systemMessage = asJson ? "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags." : "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        "stream": true,
        "max_tokens": 64e3
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai")) || this.model.includes("DeepSeek")) {
        bodyPayload.response_format = { type: "json_object" };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`
        );
      }
      const data3 = await response.json();
      console.log(data3, "data");
      return data3.choices[0].message.content;
    } catch (error) {
      console.log(error, "error");
      const statusCode = error?.status || 500;
      if (statusCode === 429) {
        throw new AppError_default(
          429,
          "Daily AI request limit exceeded. Try again tomorrow."
        );
      }
      if (statusCode === 401) {
        throw new AppError_default(
          401,
          "Invalid OpenRouter API key."
        );
      }
      throw new AppError_default(statusCode, error.message);
    }
  }
  async generateSegessions(prompt, context = [], asJson = false) {
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: prompt,
          mode: "insensitive"
        }
      },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true
      }
    });
    try {
      const aiPrompt = `
      You are an AI-powered event search engine.
      
      TASK:
      Generate ONLY event-related search suggestions.
      
      USER QUERY:
      ${prompt}
      
      AVAILABLE EVENTS:
      ${JSON.stringify(events)}

      avalible information : 
      ${context}
      
      STRICT RULES:
      - Only event suggestions
      - Short meaningful titles
      - No explanation
      - No markdown
      - JSON only
      
      RETURN FORMAT:
      {
        "suggestions": [
          {
            "title": "event title"
          }
        ]
      }
      `;
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "user",
            content: aiPrompt
          }
        ],
        temperature: 0.1,
        // Lower temperature for more deterministic JSON
        max_tokens: 1500
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai")) || this.model.includes("DeepSeek")) {
        bodyPayload.response_format = { type: "json_object" };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`
        );
      }
      const data3 = await response.json();
      return data3.choices[0].message.content;
    } catch (error) {
      if (data?.isFreeTier) {
        console.log("Free tier user");
      }
      if (data?.limitRemaining === 0) {
        throw new AppError_default(
          429,
          "Daily AI limit exceeded"
        );
      }
      if (data?.expiresAt) {
        console.log("Key expires at:", data.expiresAt);
      }
    }
  }
  async generatePersonalizedRecommendations(viewerId, prompt, context = [], asJson = false) {
    const userActivities = await prisma.userActivity.findMany({
      where: {
        viewerId
      },
      take: 10,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            category_name: true,
            location: true
          }
        }
      }
    });
    const events = userActivities.map((item) => ({
      id: item.eventid,
      title: item.event.title,
      description: item.event.description,
      location: item.event.location,
      category_name: item.event.category_name
    }));
    try {
      const aiPrompt = `
      You are an AI-powered recommendation engine.
  
      TASK:
      Generate ONLY personalized event recommendations.
  
      USER SEARCH:
      ${prompt}  
    
  
      AVAILABLE EVENTS:
      ${JSON.stringify(events)}
  
      EXTRA CONTEXT:
      ${context}
  
      STRICT RULES:
      - Only personalized event recommendations
      - Use user activity + AI history
      - Short meaningful titles
      - Professional response
      - No markdown
      - JSON only
  
      RETURN FORMAT:
      {
        "recommendations": [
          {
            "id": "event id",
            "title": "event title",
            "category": "event category",
            "images": ["url1", "url2"],  // Array of image URLs related to the event
            "description": "detailed description of the event",
            "data": { /* any relevant structured event data */ },
            "location": "event location",
       
            "reason": "recommended based on user activity"
          }
        ]
      }
      `;
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "user",
            content: aiPrompt
          }
        ]
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai") || this.model.includes("DeepSeek") || this.model.includes("deepseek"))) {
        bodyPayload.response_format = {
          type: "json_object"
        };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message || "unknown error"}`
        );
      }
      const data3 = await response.json();
      console.log(data3, "data");
      console.log(data3.choices[0].message.content, "content");
      return data3.choices[0].message.content;
    } catch (error) {
      if (data?.isFreeTier) {
        console.log("Free tier user");
      }
      if (data?.limitRemaining === 0) {
        throw new AppError_default(
          429,
          "Daily AI limit exceeded"
        );
      }
      if (data?.expiresAt) {
        console.log("Key expires at:", data.expiresAt);
      }
    }
  }
  async generateTrendingItems(prompt, context = [], asJson = false) {
    try {
      const trendingActivities = await prisma.userActivity.groupBy({
        by: ["eventid"],
        _count: {
          eventid: true
        },
        orderBy: {
          _count: {
            eventid: "desc"
          }
        }
      });
      const eventIds = trendingActivities.map((t) => t.eventid);
      const events = await prisma.event.findMany({
        where: {
          id: {
            in: eventIds
          }
        },
        select: {
          id: true,
          title: true,
          description: true,
          category_name: true,
          location: true
        }
      });
      const trendingEvents = eventIds.map(
        (id) => events.find((e) => e.id === id)
      );
      const aiPrompt = `
      You are an AI-powered trending engine.
  
      TASK:
      Generate ONLY trending event items based on user activity.
  
      USER SEARCH:
      ${prompt}
  
      AVAILABLE TRENDING EVENTS:
      ${JSON.stringify(trendingEvents)}
  
      EXTRA CONTEXT:
      ${context}
  
      STRICT RULES:
      - Only trending events
      - Based on user activity analysis
      - Short meaningful titles
      - Professional response
      - No markdown
      - JSON only
  
      RETURN FORMAT:
      {
        "trending": [
          {
              "id": "event id",
            "title": "event title",
            "category": "event category",
            "images": ["url1", "url2"],  // Array of image URLs related to the event
            "description": "detailed description of the event",
            "data": { /* any relevant structured event data */ },
            "location": "event location",
            "reason": "why this event is trending"
          }
        ]
      }
      `;
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "user",
            content: aiPrompt
          }
        ]
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai") || this.model.includes("DeepSeek") || this.model.includes("deepseek"))) {
        bodyPayload.response_format = {
          type: "json_object"
        };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message || "unknown error"}`
        );
      }
      const data3 = await response.json();
      console.log(data3, "data");
      console.log(data3.choices[0].message.content, "content");
      return data3.choices[0].message.content;
    } catch (error) {
      if (data?.isFreeTier) {
        console.log("Free tier user");
      }
      if (data?.limitRemaining === 0) {
        throw new AppError_default(
          429,
          "Daily AI limit exceeded"
        );
      }
      if (data?.expiresAt) {
        console.log("Key expires at:", data.expiresAt);
      }
    }
  }
};

// src/app/modules/rag/rag.service.ts
var RAGService = class {
  llmService;
  indexingService;
  embeddingService;
  constructor() {
    this.llmService = new LLMService();
    this.indexingService = new IndexingService();
    this.embeddingService = new EmbeddingService();
  }
  async ingestEventData() {
    return this.indexingService.indexEventsData();
  }
  async retieveRelevantDocuments(query, limit = 5, sourceType) {
    try {
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      const vectorLiteral = `[${queryEmbedding.join(",")}]`;
      const results = await prisma.$queryRaw(prismaNamespace_exports.sql`
          SELECT id, "chunkKey", "sourceType", "sourceId", "sourceLabel", content, metadata, embedding, "isDeleted", "deletedAt", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) as similarity
          FROM "document_embeddings"
          WHERE "isDeleted" = false
          ${sourceType ? prismaNamespace_exports.sql`AND "sourceType" = ${sourceType}` : prismaNamespace_exports.empty}
          ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
          Limit ${limit}
          `);
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async generateAnswer(query, limit = 5, sourceType, asJson = false) {
    try {
      const relevantDocs = await this.retieveRelevantDocuments(
        query,
        limit,
        sourceType
      );
      const context = relevantDocs.filter((doc) => doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generateResponse(
        query,
        context,
        asJson
      );
      let parsedAnswer = answer;
      if (asJson) {
        try {
          if (answer.startsWith("```json")) {
            answer = answer.replace(/```json\n?/, "").replace(/```$/, "").trim();
          } else if (answer.startsWith("```")) {
            answer = answer.replace(/```\n?/, "").replace(/```$/, "").trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (e) {
          console.error("Failed to parse LLM JSON response:", e);
          throw e;
        }
      }
      return {
        answer: parsedAnswer,
        sources: relevantDocs.map((doc) => ({
          id: doc.id,
          chunkKey: doc.chunkKey,
          sourceType: doc.sourceType,
          sourceId: doc.sourceId,
          sourceLabel: doc.sourceLabel,
          content: doc.content,
          similarity: doc.similarity
        })),
        contextUsed: context.length > 0
      };
    } catch (error) {
      console.log(error);
    }
  }
  async generateSuggessions(query, asJson = false) {
    try {
      const relevantDocs = await this.retieveRelevantDocuments(
        query
      );
      const context = relevantDocs.filter((doc) => doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generateSegessions(
        query,
        context,
        asJson
      );
      let parsedAnswer = answer;
      if (asJson) {
        try {
          if (answer.startsWith("```json")) {
            answer = answer.replace(/```json\n?/, "").replace(/```$/, "").trim();
          } else if (answer.startsWith("```")) {
            answer = answer.replace(/```\n?/, "").replace(/```$/, "").trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (e) {
          console.error("Failed to parse LLM JSON response:", e);
          throw e;
        }
      }
      return {
        answer: parsedAnswer
      };
    } catch (error) {
      console.log(error);
    }
  }
  async generatePersonalizedRecommendations(viewerId, query, asJson = false) {
    try {
      const relevantDocs = await this.retieveRelevantDocuments(query);
      const context = relevantDocs.filter((doc) => doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generatePersonalizedRecommendations(
        viewerId,
        query,
        context,
        asJson
      );
      let parsedAnswer = answer;
      console.log(parsedAnswer, "par");
      if (asJson) {
        try {
          if (answer.startsWith("```json")) {
            answer = answer.replace(/```json\n?/g, "").replace(/```$/g, "").trim();
          } else if (answer.startsWith("```")) {
            answer = answer.replace(/```\n?/g, "").replace(/```$/g, "").trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (e) {
          console.error(
            "Failed to parse AI recommendation JSON response:",
            e
          );
          throw e;
        }
      }
      console.log(parsedAnswer, "answer");
      return {
        answer: parsedAnswer
      };
    } catch (error) {
      console.log(
        "Personalized Recommendation Error:",
        error
      );
      throw error;
    }
  }
  async generateTrendingItems(query, asJson = false) {
    try {
      const relevantDocs = await this.retieveRelevantDocuments(query);
      const context = relevantDocs.filter((doc) => doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generateTrendingItems(
        query,
        context,
        asJson
      );
      let parsedAnswer = answer;
      console.log(parsedAnswer, "raw-answer");
      if (asJson) {
        try {
          if (answer.startsWith("```json")) {
            answer = answer.replace(/```json\n?/g, "").replace(/```$/g, "").trim();
          } else if (answer.startsWith("```")) {
            answer = answer.replace(/```\n?/g, "").replace(/```$/g, "").trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (e) {
          console.error(
            "Failed to parse personalized recommendation JSON:",
            e
          );
          throw e;
        }
      }
      console.log(parsedAnswer, "parsed-answer");
      return {
        answer: parsedAnswer
      };
    } catch (error) {
      console.error(
        "Personalized Recommendation Error:",
        error
      );
      throw error;
    }
  }
  async getStats() {
    try {
      const totalDocuments = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT COUNT(*) as count FROM "document_embeddings" WHERE "isDeleted" = false;
        `);
      const sourceTypeCounts = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT "sourceType", COUNT(*) as count FROM "document_embeddings" WHERE "isDeleted" = false GROUP BY "sourceType"
        `);
      return {
        totalActiveDocuments: Number(totalDocuments[0]?.count ?? 0),
        sourceTypeBreakdown: sourceTypeCounts.reduce(
          (acc, curr) => {
            acc[curr.sourceType] = Number(curr.count);
            return acc;
          },
          {}
        ),
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// src/app/modules/rag/rag.controller.ts
import status25 from "http-status";
import { OpenRouter as OpenRouter2 } from "@openrouter/sdk";

// src/app/lib/redis.ts
import { Redis } from "@upstash/redis";
var RedisService = class {
  client = null;
  isConnected = false;
  async connect() {
    try {
      this.client = new Redis({
        url: envVars.UPSTASH_REDIS_REST_URL,
        token: envVars.UPSTASH_REDIS_REST_TOKEN
      });
      this.isConnected = true;
      console.log("Redis Client Ready (Upstash)");
    } catch (error) {
      console.log({ error }, "Error connecting to Redis");
      this.isConnected = false;
    }
  }
  ensureConnection() {
    if (!this.client) {
      throw new Error("Redis client not initialized. call connect() first.");
    }
    if (!this.isConnected) {
      throw new Error("Redis client not connected");
    }
    return this.client;
  }
  async get(key) {
    try {
      const client = this.ensureConnection();
      return await client.get(key);
    } catch (error) {
      console.error({ error }, "Redis get error");
      return null;
    }
  }
  async set(key, value, ttlInSecond) {
    try {
      const client = this.ensureConnection();
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      await client.set(key, stringValue, {
        ex: ttlInSecond
      });
    } catch (err) {
      console.error({ error: err }, "Redis set error");
    }
  }
  async update(key, value, ttlInSeconds) {
    await this.set(key, value, ttlInSeconds);
  }
  async delete(key) {
    try {
      const client = this.ensureConnection();
      await client.del(key);
    } catch (error) {
      console.error({ error }, "Redis delete error");
    }
  }
  async isAvailable() {
    try {
      const client = this.ensureConnection();
      const res = await client.ping();
      return res === "PONG";
    } catch (error) {
      console.error({ error }, "Redis ping error");
      return false;
    }
  }
  async disconnect() {
    this.client = null;
    this.isConnected = false;
    console.info("Redis Client Disconnected (virtual)");
  }
};
var redisService = new RedisService();

// src/app/modules/rag/rag.controller.ts
var ragService = new RAGService();
var openRouter2 = new OpenRouter2({
  apiKey: envVars.RAG.OPENROUTER_API_KEY
});
var keyInfo2 = await openRouter2.apiKeys.getCurrentKeyMetadata();
var data2 = keyInfo2.data;
if (data2?.isFreeTier) {
  console.log("Free tier user");
}
if (data2?.limitRemaining === 0) {
  throw new AppError_default(429, "Daily AI limit exceeded");
}
if (data2?.expiresAt) {
  console.log("Key expires at:", data2.expiresAt);
}
var getStats = catchAsync(async (req, res) => {
  const result = await ragService.getStats();
  const openRouter3 = new OpenRouter2({
    apiKey: envVars.RAG.OPENROUTER_API_KEY
  });
  sendResponse(res, {
    success: true,
    httpStatusCode: status25.OK,
    message: "RAG stats retrieved successfully",
    data: result
  });
});
var Ingestevents = catchAsync(async (req, res) => {
  const result = await ragService.ingestEventData();
  console.log(result, "reselts");
  sendResponse(res, {
    success: true,
    message: "ingest event successfully",
    httpStatusCode: 200,
    data: result
  });
});
var querySuggession = catchAsync(async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status25.BAD_REQUEST,
        message: "prompt is required"
      });
    }
    const cacheKey = `suggession:prompt:${prompt}`;
    try {
      const cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        return sendResponse(res, {
          success: true,
          httpStatusCode: status25.OK,
          message: "Answer retrieved from cache",
          data: cacheResult
        });
      }
    } catch (error) {
      console.log(error.status, "s");
      console.warn(
        "Cache read error , proceeding with normal processing ",
        error
      );
      throw Error;
    }
    let result;
    try {
      result = await ragService.generateSuggessions(prompt, true);
    } catch (error) {
      console.log("Error in ragService.generateSuggessions:", error);
      throw error;
    }
    try {
      let dataToCache = result?.answer.suggestions;
      if (!dataToCache || dataToCache === 0 || dataToCache.length === 0) {
        dataToCache = {
          suggestions: [
            { title: "Tech Innovation Summit 2026" },
            { title: "Global AI Conference" },
            { title: "Frontend Developer Meetup" },
            { title: "Startup Networking Night" },
            { title: "Cyber Security Workshop" },
            { title: "Music Festival 2026" },
            { title: "UI/UX Design Masterclass" },
            { title: "Blockchain Expo" },
            { title: "Digital Marketing Bootcamp" },
            { title: "Cloud Computing Workshop" }
          ]
        };
      }
      await redisService.set(cacheKey, dataToCache, 600);
    } catch (error) {
      throw Error;
    }
    sendResponse(res, {
      success: true,
      httpStatusCode: status25.OK,
      message: "Suggestions generated successfully based on your input",
      data: result?.answer
    });
  } catch (error) {
    const data3 = keyInfo2.data;
    console.log(data3, "data");
    if (data3?.isFreeTier) {
      console.log("Free tier user");
    }
    if (data3?.limitRemaining === 0 || data3.limitRemaining == null) {
      throw new AppError_default(429, "Daily AI limit exceeded");
    }
    if (data3?.expiresAt) {
      throw new AppError_default(400, `Key expires at: ${data3.expiresAt}`);
    }
    if (error.response?.status === 429) {
      throw new Error(
        "Daily AI request limit exceeded. Please try again tomorrow or upgrade your API plan."
      );
    }
    throw new Error("Failed to generate AI response");
  }
});
var personalizedRecommendation = catchAsync(
  async (req, res) => {
    try {
      const { prompt } = req.body;
      const viewerId = req.viewerId;
      if (!viewerId) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status25.BAD_REQUEST,
          message: "viewerId is required"
        });
      }
      if (!prompt) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status25.BAD_REQUEST,
          message: "prompt is required"
        });
      }
      const cacheKey = `personalizedRecommendation:prompt:${viewerId}:${prompt}`;
      try {
        const cacheResult = await redisService.get(cacheKey);
        if (cacheResult) {
          return sendResponse(res, {
            success: true,
            httpStatusCode: status25.OK,
            message: "Personalized recommendations retrieved from cache",
            data: cacheResult
          });
        }
      } catch (error) {
        console.error("PersonalizedRecommendation: Cache read error:", error);
      }
      let result;
      try {
        result = await ragService.generatePersonalizedRecommendations(
          viewerId,
          prompt,
          true
        );
      } catch (error) {
        throw Error;
      }
      console.log(result, "rsult");
      if (!result || !result.answer || !Array.isArray(result.answer.recommendations) || result.answer.recommendations.length === 0) {
        throw Error;
      }
      try {
        let dataToCache = result.answer.recommendations;
        await redisService.set(cacheKey, dataToCache, 600);
      } catch (error) {
        console.error("PersonalizedRecommendation: Cache write error:", error);
      }
      return sendResponse(res, {
        success: true,
        httpStatusCode: status25.OK,
        message: "Personalized recommendations generated successfully",
        data: result.answer
      });
    } catch (error) {
      const data3 = keyInfo2.data;
      console.log(data3, "data");
      if (data3?.isFreeTier) {
        console.log("Free tier user");
      }
      if (data3?.limitRemaining === 0 || data3.limitRemaining == null) {
        throw new AppError_default(429, "Daily AI limit exceeded");
      }
      if (data3?.expiresAt) {
        throw new AppError_default(400, `Key expires at: ${data3.expiresAt}`);
      }
      if (error?.message?.includes("429") || error?.response?.status === 429) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status25.TOO_MANY_REQUESTS,
          message: "Daily AI request limit exceeded. Please try again later."
        });
      }
      console.error("Personalized Recommendation Controller Error:", error);
      return sendResponse(res, {
        success: false,
        httpStatusCode: status25.INTERNAL_SERVER_ERROR,
        message: "Failed to generate personalized recommendations"
      });
    }
  }
);
var trendingItems = catchAsync(async (req, res) => {
  try {
    const { prompt } = req.body;
    let finalPrompt = prompt;
    if (!finalPrompt) {
      finalPrompt = "give me event trending items";
    }
    const cacheKey = `trendingItems:prompt:${finalPrompt}`;
    try {
      const cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        const parsedData = typeof cacheResult === "string" ? JSON.parse(cacheResult) : cacheResult;
        return sendResponse(res, {
          success: true,
          httpStatusCode: status25.OK,
          message: "Trending items retrieved from cache",
          data: parsedData
        });
      }
    } catch (error) {
      throw Error;
    }
    let result;
    try {
      result = await ragService.generateTrendingItems(finalPrompt, true);
    } catch (error) {
      throw Error;
    }
    if (!result || !result.answer || !Array.isArray(result.answer.trending) || result.answer.trending.length === 0) {
      throw Error;
    }
    try {
      await redisService.set(cacheKey, result.answer.trending, 600);
    } catch (error) {
      throw Error;
    }
    return sendResponse(res, {
      success: true,
      httpStatusCode: status25.OK,
      message: "Trending items generated successfully",
      data: result.answer
    });
  } catch (error) {
    const data3 = keyInfo2.data;
    console.log(data3, "data");
    if (data3?.isFreeTier) {
      console.log("Free tier user");
    }
    if (data3?.limitRemaining === 0 || data3.limitRemaining == null) {
      throw new AppError_default(429, "Daily AI limit exceeded");
    }
    if (data3?.expiresAt) {
      throw new AppError_default(400, `Key expires at: ${data3.expiresAt}`);
    }
    if (error?.message?.includes("429") || error?.response?.status === 429) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status25.TOO_MANY_REQUESTS,
        message: "Daily AI request limit exceeded. Please try again later."
      });
    }
    return sendResponse(res, {
      success: false,
      httpStatusCode: status25.INTERNAL_SERVER_ERROR,
      message: "Failed to generate trending items"
    });
  }
});
var queryRag = catchAsync(async (req, res) => {
  const { query, limit, sourceType } = req.body;
  try {
    if (!query) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status25.BAD_REQUEST,
        message: "Query is required"
      });
    }
    const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || "all"}`;
    try {
      const cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        const parseData = JSON.parse(cacheResult);
        return sendResponse(res, {
          success: true,
          httpStatusCode: status25.OK,
          message: "Answer retrieved from cache",
          data: parseData
        });
      }
    } catch (error) {
      throw Error;
    }
    const result = await ragService.generateAnswer(
      query,
      limit ?? 5,
      sourceType,
      true
    );
    if (!result || !result.answer || !Array.isArray(result.answer) || result.answer.length === 0) {
      throw Error;
    }
    try {
      const dat = await redisService.set(cacheKey, result, 600);
      console.log(dat, "da");
    } catch (error) {
      console.log("cache Write error", error);
    }
    return sendResponse(res, {
      success: true,
      httpStatusCode: status25.OK,
      message: "Answer generated successfully",
      data: result
    });
  } catch (err) {
    const data3 = keyInfo2.data;
    console.log(data3, "data");
    if (data3?.isFreeTier) {
      console.log("Free tier user");
    }
    if (data3?.limitRemaining === 0 || data3.limitRemaining == null) {
      throw new AppError_default(429, "Daily AI limit exceeded");
    }
    if (data3?.expiresAt) {
      throw new AppError_default(400, `Key expires at: ${data3.expiresAt}`);
    }
    console.warn(
      "Cache read error , proceeding with normal processing ",
      err
    );
    const httpStatus = err?.status || err?.statusCode || status25.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error occurred while processing the request.";
    if (httpStatus === 429 || err?.message && err.message.includes("429") || err?.message && err.message.includes("rate limit")) {
      message = "Rate limit exceeded on the LLM provider (OpenRouter). Please try again later or add credits if required.";
    } else if (err?.message) {
      message = err.message;
    }
    console.error("RAG Controller Error:", err);
    return sendResponse(res, {
      success: false,
      httpStatusCode: httpStatus,
      message
    });
  }
});
var RagController = {
  getStats,
  Ingestevents,
  queryRag,
  querySuggession,
  personalizedRecommendation,
  trendingItems
};

// src/app/modules/rag/rag.route.ts
var router12 = Router8();
router12.get("/stats", RagController.getStats);
router12.post("/ingest-event", RagController.Ingestevents);
router12.post("/query", RagController.queryRag);
router12.post("/suggest", RagController.querySuggession);
router12.post(
  "/recommendations",
  attachViewer,
  RagController.personalizedRecommendation
);
router12.post(
  "/trending-items",
  RagController.trendingItems
);
var Ragrouter = router12;

// src/app/modules/newsletter/newsletter.route.ts
import { Router as Router9 } from "express";
init_enums();

// src/app/modules/newsletter/newsletter.validation.ts
import { z as z9 } from "zod";
var createNewsletterSchema = z9.object({
  email: z9.string()
});
var updateNewsletterSchema = z9.object({
  email: z9.string().optional()
});

// src/app/modules/newsletter/newsletter.controller.ts
import status27 from "http-status";

// src/app/modules/newsletter/newsletter.service.ts
import status26 from "http-status";
init_prisma();
var createNewsletter = async (payload) => {
  console.log(payload.email, "emi");
  if (!payload.email || !payload.userId) {
    throw new AppError_default(status26.BAD_REQUEST, "Email and userId are required to subscribe to the newsletter.");
  }
  const existing = await prisma.newsletter.findUnique({
    where: { email: payload.email }
  });
  if (existing) {
    throw new AppError_default(status26.CONFLICT, "This email is already subscribed to the newsletter.");
  }
  const newsletter = await prisma.newsletter.create({
    data: {
      email: payload.email,
      userId: payload.userId
    }
  });
  return newsletter;
};
var getAllNewsletters = async (query, page, limit, skip) => {
  const andConditions = [];
  if (query?.email) {
    andConditions.push({
      email: {
        contains: query.email,
        mode: "insensitive"
      }
    });
  }
  if (query?.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  const newsletters = await prisma.newsletter.findMany({
    skip: skip || (page && limit ? (page - 1) * limit : void 0),
    take: limit,
    where: { AND: andConditions },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  const total = await prisma.newsletter.count({ where: { AND: andConditions } });
  return {
    data: newsletters,
    pagination: {
      total,
      page: page || 1,
      limit: 9,
      totalpage: limit ? Math.ceil(total / limit) : 1
    }
  };
};
var getSingleNewsletter = async (newsletterId) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  if (!newsletter) {
    throw new AppError_default(status26.NOT_FOUND, "Newsletter subscription not found");
  }
  return newsletter;
};
var updateNewsletter = async (newsletterId, payload) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId }
  });
  if (!newsletter) {
    throw new AppError_default(status26.NOT_FOUND, "Newsletter subscription not found");
  }
  if (payload.email && payload.email !== newsletter.email) {
    const existing = await prisma.newsletter.findUnique({
      where: { email: payload.email }
    });
    if (existing) {
      throw new AppError_default(status26.CONFLICT, "This email is already subscribed to the newsletter.");
    }
  }
  const updatedNewsletter = await prisma.newsletter.update({
    where: { id: newsletterId },
    data: payload
  });
  return updatedNewsletter;
};
var deleteNewsletter = async (newsletterId) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId }
  });
  if (!newsletter) {
    throw new AppError_default(status26.NOT_FOUND, "Newsletter subscription not found");
  }
  const deletedNewsletter = await prisma.newsletter.delete({
    where: { id: newsletterId }
  });
  return deletedNewsletter;
};
var NewsletterService = {
  createNewsletter,
  getAllNewsletters,
  getSingleNewsletter,
  updateNewsletter,
  deleteNewsletter
};

// src/app/modules/newsletter/newsletter.controller.ts
var createNewsletter2 = catchAsync(async (req, res) => {
  if (!req.user?.userId) {
    throw new AppError_default(status27.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const { email } = req.body;
  console.log(email, "email");
  const result = await NewsletterService.createNewsletter({ email, userId: req.user.userId });
  sendResponse(res, {
    httpStatusCode: status27.CREATED,
    success: true,
    message: "Newsletter subscription created successfully",
    data: result
  });
});
var getAllNewsletters2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await NewsletterService.getAllNewsletters(req.query, page, limit, skip);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Newsletters fetched successfully",
    data: result
  });
});
var getSingleNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NewsletterService.getSingleNewsletter(id);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Newsletter fetched successfully",
    data: result
  });
});
var updateNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body.email !== void 0 && { email: req.body.email }
  };
  const result = await NewsletterService.updateNewsletter(id, payload);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Newsletter updated successfully",
    data: result
  });
});
var deleteNewsletter2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NewsletterService.deleteNewsletter(id);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Newsletter deleted successfully",
    data: result
  });
});
var NewsletterController = {
  createNewsletter: createNewsletter2,
  getAllNewsletters: getAllNewsletters2,
  getSingleNewsletter: getSingleNewsletter2,
  updateNewsletter: updateNewsletter2,
  deleteNewsletter: deleteNewsletter2
};

// src/app/modules/newsletter/newsletter.route.ts
var router13 = Router9();
router13.post(
  "/newsletter",
  Auth_default([Role.ADMIN, Role.USER, Role.MANAGER]),
  validateRequest(createNewsletterSchema),
  NewsletterController.createNewsletter
);
router13.get(
  "/newsletters",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  NewsletterController.getAllNewsletters
);
router13.get(
  "/newsletter/:id",
  NewsletterController.getSingleNewsletter
);
router13.put(
  "/newsletter/:id",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  validateRequest(updateNewsletterSchema),
  NewsletterController.updateNewsletter
);
router13.delete(
  "/newsletter/:id",
  Auth_default([Role.ADMIN, Role.MANAGER]),
  NewsletterController.deleteNewsletter
);
var NewsletterRouters = router13;

// src/app/modules/category/category.route.ts
import { Router as Router10 } from "express";

// src/app/modules/category/category.service.ts
init_prisma();
import status28 from "http-status";
var CreateCategory = async (data3, email) => {
  if (!data3.image) {
    throw new AppError_default(404, "Image is required");
  }
  const adminUser = await prisma.user.findUnique({
    where: { email }
  });
  if (!adminUser) {
    throw new AppError_default(status28.UNAUTHORIZED, "Admin user not found or unauthorized");
  }
  const adminId = adminUser.id;
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data3.name
    }
  });
  if (categorydata) {
    throw new AppError_default(409, "Category already exists");
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: adminId }
  });
  const result = await prisma.category.create({
    data: {
      ...data3,
      adminId
    }
  });
  return result;
};
var getCategory = async (data3, page, limit, skip) => {
  const andConditions = [];
  if (data3?.name) {
    andConditions.push({
      name: data3.name
    });
  }
  if (data3?.createdAt) {
    const dateRange = parseDateForPrisma(data3.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (data3?.adminId) {
    andConditions.push({
      adminId: {
        contains: data3.adminId,
        mode: "insensitive"
      }
    });
  }
  if (data3?.id) {
    andConditions.push({
      id: {
        contains: data3.id,
        mode: "insensitive"
      }
    });
  }
  const result = await prisma.category.findMany({
    where: {
      AND: andConditions
    },
    include: {
      event: true,
      user: true
    },
    orderBy: { name: "desc" }
  });
  const total = await prisma.category.count({ where: {
    AND: andConditions
  } });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var SingleCategory = async (id, viewerId, query, page, limit, skip, search) => {
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
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      event: {
        include: {
          reviews: true
        }
      },
      user: true
    }
  });
  const events = await prisma.event.findMany({
    where: {
      category_name: result.name,
      status: "UPCOMING",
      AND: andConditions
    },
    take: limit,
    skip,
    include: {
      reviews: {
        where: { rating: { gt: 0 } }
      },
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const eventdata = events.map(async (event) => {
    const totalReviews = event.reviews.length;
    const avgRating = totalReviews > 0 ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    await prisma.userActivity.upsert({
      where: {
        viewerId_eventid_category: {
          viewerId,
          eventid: event.id,
          category: event.category_name
        }
      },
      create: { viewerId, eventid: event.id, category: event.category_name },
      update: {
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { ...event, avgRating, totalReviews };
  });
  const total = await prisma.event.count({ where: { AND: andConditions } });
  return {
    data: {
      result,
      eventdata
    },
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var UpdateCategory = async (id, data3) => {
  const { name } = data3;
  if (!data3.image) {
    throw new AppError_default(404, "Image is required");
  }
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id }
  });
  if (existcategory.name == name) {
    throw new AppError_default(409, "Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      ...data3
    }
  });
  return result;
};
var DeleteCategory = async (id) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory
};

// src/app/modules/category/category.controller.ts
import { status as status29 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status29.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const payload = {
      ...req.body,
      image: req.file?.path || req.body.image
    };
    const result = await categoryService.CreateCategory(
      payload,
      user.email
    );
    sendResponse(res, {
      httpStatusCode: status29.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await categoryService.getCategory(req.query, page, limit, skip);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const { page, limit, skip } = paginationHelping_default(req.query);
  const viewerId = req.viewerId;
  const result = await categoryService.SingleCategory(
    req.params.id,
    viewerId,
    req.query,
    page,
    limit,
    skip,
    typeof req.query.search === "string" ? req.query.search : void 0
  );
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "retrieve single category successfully",
    data: result
  });
});
var UpdateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.UpdateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "your category has beed deleted",
    data: result
  });
});
var CategoryController = {
  CreateCategory: CreateCategory2,
  getCategory: getCategory2,
  UpdateCategory: UpdateCategory2,
  DeleteCategory: DeleteCategory2,
  SingleCategory: SingleCategory2
};

// src/app/modules/category/category.validation.ts
import z10 from "zod";
var createcategoryData = z10.object({
  name: z10.string(),
  image: z10.any()
}).strict();
var UpdatecategoryData = z10.object({
  name: z10.string().optional(),
  image: z10.any().optional()
});

// src/app/modules/category/category.route.ts
init_enums();
var router14 = Router10();
router14.post("/category", Auth_default([Role.ADMIN, Role.MANAGER]), multerUpload.single("file"), validateRequest(createcategoryData), CategoryController.CreateCategory);
router14.get("/category", CategoryController.getCategory);
router14.get("/category/:id", attachViewer, CategoryController.SingleCategory);
router14.put("/admin/category/:id", Auth_default([Role.ADMIN]), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router14.delete("/admin/category/:id", Auth_default([Role.ADMIN]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router14 };

// src/app/modules/ai/ai.route.ts
import express5 from "express";

// src/app/config/gemini.config.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: envVars.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
var gemini_config_default = openai;

// src/app/modules/ai/ai.service.ts
init_prisma();
var llm = new LLMService();
var searchSuggestions = async (prompt) => {
  console.log(prompt, "prompt");
  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: prompt,
        mode: "insensitive"
      }
    },
    take: 5,
    select: {
      id: true,
      title: true,
      description: true
    }
  });
  const content = `
  You are an AI-powered event search engine
  TASK:
  Generate ONLY event-related search suggestions based on the user query and available event data.
  
  USER QUERY:
  ${prompt}
  
  AVAILABLE EVENTS:
  ${JSON.stringify(events)}
  
  STRICT RULES:
  - Only return event-related suggestions
  - Each suggestion must be short and meaningful
  - No explanation, no extra text
  - Do NOT include non-event data
  - Do NOT include markdown or text outside JSON
  
  OUTPUT FORMAT (STRICT JSON):
  {
    "suggestions": [
      {
        "title": "short event title"
      }
    ]
  }
  `;
  const response = await gemini_config_default.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
      {
        role: "user",
        content
      }
    ],
    response_format: { type: "json_object" }
  });
  const responseContent = response.choices[0].message.content;
  console.log(responseContent, "content");
  const result = JSON.parse(responseContent || "{}");
  return result;
};
var aiService = {
  searchSuggestions
};

// src/app/modules/ai/ai.controller.ts
var searchSuggestions2 = catchAsync(async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      throw new AppError_default(400, "Search query is required");
    }
    const result = await aiService.searchSuggestions(
      prompt
    );
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Search suggestions generated successfully",
      data: result
    });
  } catch (error) {
    console.log(error.status, "error");
    if (error.status === 429) {
      throw new AppError_default(429, "Too many requests: Daily search limit reached");
    }
    throw new AppError_default(400, error.message);
  }
});
var aiSearchController = {
  searchSuggestions: searchSuggestions2
  // getRecommendations,
  // getTrending,
};

// src/app/modules/ai/ai.route.ts
var router15 = express5.Router();
router15.post("/suggest", aiSearchController.searchSuggestions);
var AiRouter = router15;

// src/app/routes/index.ts
var router16 = Router11();
router16.use("/v1/rag", Ragrouter);
router16.use("/v1/ai", AiRouter);
router16.use("/v1", BlogRouters);
router16.use("/v1", HighlightRouters);
router16.use("/v1", NewsletterRouters);
router16.use("/v1/auth", AuthRouters);
router16.use("/v1", CategoryRouter.router);
router16.use("/v1", UsersRoutes);
router16.use("/v1", EventRouters);
router16.use("/v1", InvitationsRouters);
router16.use("/v1", ParticipantRoutes);
router16.use("/v1", ReviewsRouters);
router16.use("/v1", StatsRoutes);
router16.use("/v1", NotificationRoutes);
router16.use("/v1", PaymentRoutes);
var IndexRouter = router16;

// src/app.ts
var app = express6();
app.use("/api/auth", toNodeHandler(auth));
app.set("view engine", "ejs");
app.set("views", path2.resolve(process.cwd(), `src/app/templates`));
app.post("/webhook", express6.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(cookieParser());
app.use(cors({
  origin: envVars.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express6.urlencoded({ extended: true }));
app.use(express6.json());
app.use("/api", IndexRouter);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to your event's new era \u2014 discover, organize, and elevate experiences with Lumen!" });
});
app.use(globalErrorHandeller_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var server;
var port = 5e3;
var bootstrap = async () => {
  try {
    await redisService.connect().catch(console.error);
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
