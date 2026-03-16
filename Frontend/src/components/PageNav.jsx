import { NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  UserPlus,
  LogIn,
  User,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

export default function PageNav() {
  const { authUser } = useAuthStore();

  return (
    <nav className="page-nav" aria-label="Primary navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <span className="nav-link-content">
          <Home className="nav-icon" aria-hidden="true" />
          Home
        </span>
      </NavLink>
      {authUser && (
        <NavLink
          to="/chat"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-link-content">
            <MessageSquare className="nav-icon" aria-hidden="true" />
            Chat
          </span>
        </NavLink>
      )}
      {!authUser && (
        <NavLink
          to="/signup"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-link-content">
            <UserPlus className="nav-icon" aria-hidden="true" />
            Signup
          </span>
        </NavLink>
      )}
      {!authUser && (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-link-content">
            <LogIn className="nav-icon" aria-hidden="true" />
            Login
          </span>
        </NavLink>
      )}
      {authUser && (
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-link-content">
            <User className="nav-icon" aria-hidden="true" />
            Profile
          </span>
        </NavLink>
      )}
      {authUser && (
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-link-content">
            <Settings className="nav-icon" aria-hidden="true" />
            Settings
          </span>
        </NavLink>
      )}
    </nav>
  );
}
