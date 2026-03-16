import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isSendingResetCode: false,
  isResettingPassword: false,
  error: null,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data, isSigningUp: false });
      toast.success("Signup successful");
      get().connectSocket();
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isSigningUp: false, error: message });
      toast.error(message || "Signup failed");
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data, isLoggingIn: false });
      toast.success("Login successful");
      get().connectSocket();
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isLoggingIn: false, error: message });
      toast.error(message || "Login failed");
      throw error;
    }
  },

  logout: async () => {
    set({ isLoggingOut: true, error: null });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, isLoggingOut: false });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isLoggingOut: false, error: message });
      toast.error(message || "Logout failed");
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: response.data, isUpdatingProfile: false });
      toast.success("Profile picture updated");
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isUpdatingProfile: false, error: message });
      toast.error(message || "Profile update failed");
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingResetCode: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      toast.success(response?.data?.message || "Reset code sent");
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isSendingResetCode: false, error: message });
      toast.error(message || "Failed to send reset code");
      throw error;
    }
  },

  resetPassword: async (payload) => {
    set({ isResettingPassword: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/auth/reset-password",
        payload,
      );
      set({ isResettingPassword: false });
      toast.success(response?.data?.message || "Password reset successful");
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ isResettingPassword: false, error: message });
      toast.error(message || "Failed to reset password");
      throw error;
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().Socket?.connected) {
      console.warn("Cannot connect socket: No authenticated user");
      return;
    }
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ Socket: socket });
    socket.on("usersOnline", (userIds) => {
      set({ usersOnline: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().Socket) {
      get().Socket.disconnect();
    }
  },
}));
