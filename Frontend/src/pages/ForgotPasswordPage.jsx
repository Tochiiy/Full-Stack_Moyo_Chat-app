import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import PageNav from "../components/PageNav.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isSendingResetCode } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword(email.trim());
    } catch {
      // Toast is handled in store.
    }
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="auth-layout">
        <section className="auth-card">
          <h1>Forgot Password</h1>
          <p>Enter your account email and we will send you a reset code.</p>
        </section>

        <section className="auth-card">
          <h2>Send Reset Code</h2>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="input-with-icon">
              <Mail className="field-icon" size={18} aria-hidden="true" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSendingResetCode}
            >
              {isSendingResetCode ? (
                <>
                  <LoaderCircle className="btn-loader-icon" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </button>

            <p className="auth-switch-text">
              Remembered your password? <Link to="/login">Login</Link>
            </p>
            <p className="auth-switch-text">
              Got a code? <Link to="/reset-password">Reset password</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
