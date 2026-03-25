import express, { Application } from "express";
import { IndexRouter } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// auth
app.use("/api", IndexRouter);


app.use('/api/auth',toNodeHandler(auth))
app.use(notFound)



export default app;