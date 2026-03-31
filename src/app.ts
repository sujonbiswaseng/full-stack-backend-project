import express, { Application, Request, Response } from "express";

import { notFound } from "./app/middleware/notFound";
import cookieParser from 'cookie-parser';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from 'cors'
import errorHandler from "./app/middleware/globalErrorHandeller";
import { IndexRouter } from "./app/routes";
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();
// Express has built-in body parsing, but here's an example use of body-parser middleware if required:

app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`) )
app.post("/webhook", express.raw({ type: "application/json" }),PaymentController.handleStripeWebhookEvent);
app.use('/api/auth',toNodeHandler(auth))
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api",IndexRouter);


app.use(errorHandler)
app.use(notFound)

export default app;