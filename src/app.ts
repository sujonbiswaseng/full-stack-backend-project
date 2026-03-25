import express, { Application } from "express";
import { IndexRouter } from "./app/routes";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// auth
app.use("/api", IndexRouter);


export default app;