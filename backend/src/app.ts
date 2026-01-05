import cors from "cors";
import express from "express";

import { authRoute } from "./routes/auth.route";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({ success: true, message: "Backend is running" });
});

app.use("/api/auth", authRoute);
