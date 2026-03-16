import { io } from "socket.io-client";

// Create and export a singleton socket instance
export const socket = io("http://localhost:5001", {
  withCredentials: true,
});
