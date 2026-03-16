import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const httpServer = http.createServer(app);

let ioInstance = null;

ioInstance = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  },
});

export function getRecieversSocketID(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

ioInstance.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  console.log(`Mapped user ${userId} to socket ${socket.id}`);
  ioInstance.emit("usersOnline", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId];
  });
});

export { ioInstance, app, httpServer };
