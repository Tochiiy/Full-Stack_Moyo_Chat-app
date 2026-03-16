import { Navigate, Route, Routes } from "react-router-dom";
import HomepagePage from "./pages/HomepagePage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="app-loader-wrap" role="status" aria-live="polite">
        <LoaderCircle className="app-loader-icon" aria-hidden="true" />
        <p className="app-loader-text">Checking session...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={authUser ? <FeedPage /> : <HomepagePage />} />
      <Route path="/homepage" element={<HomepagePage />} />
      <Route
        path="/chat"
        element={authUser ? <ChatPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignupPage /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/forgot-password"
        element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
      />
      <Route
        path="/reset-password"
        element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
      />
      <Route path="/logout" element={<LogoutPage />} />
      <Route
        path="/profile"
        element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/settings"
        element={authUser ? <SettingsPage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
