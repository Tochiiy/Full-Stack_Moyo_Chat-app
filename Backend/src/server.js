// ...existing code...
import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import messageRoutes from "../routes/message.route.js";
import connectDB from "../lib/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
  });
}
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on 0.0.0.0:${PORT}`);
  });
};

startServer();
