// ...existing code...
import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import messageRoutes from "../routes/message.route.js";
import connectDB from "../lib/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ioInstance, httpServer, app } from "../lib/socket.io.js";
dotenv.config();

const MAX_REQUEST_SIZE = process.env.MAX_REQUEST_SIZE || "10mb";

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
