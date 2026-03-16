import express from "express";
import { protectRoute } from "../middleware.js/auth.middleware.js";
import {
  getUsersForSideBar,
  getMessages,
  sendMessages,
} from "../src/controllers/message.controller.js";

const router = express.Router();

// Define your message-related routes here

router.get("/users", protectRoute, getUsersForSideBar); // Example route to get users, replace with actual controller function
router.get("/:id", protectRoute, getMessages); // Example route to get messages by user ID, replace with actual controller function
router.post("/send/:id", protectRoute, sendMessages); // Example route to send messages, replace with actual controller function
export default router;
