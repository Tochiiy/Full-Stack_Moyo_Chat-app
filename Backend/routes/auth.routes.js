import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  forgotPassword,
  resetPassword,
} from "../src/controllers/auth.controller.js";
import { protectRoute } from "../middleware.js/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
export default router;
