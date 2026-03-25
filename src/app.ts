import express, { Application, Request, Response } from "express";
import { IndexRouter } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cookieParser from "cookie-parser";
import path from "path";
import cors from 'cors'
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();

app.post("/webhook", express.raw({ type: "application/json" }),PaymentController.handleStripeWebhookEvent);
// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`) )

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// auth
app.use("/api", IndexRouter);
app.use('/api/auth',toNodeHandler(auth))
app.use(notFound)
export default app;