import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import PageNav from "../components/PageNav.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, isResettingPassword } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.code.trim() || !formData.newPassword.trim()) {
      toast.error("Email, code and new password are required");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error("Password must include at least one letter and one number");
      return;
    }

    try {
      await resetPassword({
        email: formData.email.trim(),
        code: formData.code.trim(),
        newPassword: formData.newPassword,
      });
      navigate("/login", { replace: true });
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
          <h1>Reset Password</h1>
          <p>Use the reset code from your email and choose a new password.</p>
        </section>

        <section className="auth-card">
          <h2>Reset Form</h2>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="input-with-icon">
              <Mail className="field-icon" size={18} aria-hidden="true" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-with-icon">
              <ShieldCheck className="field-icon" size={18} aria-hidden="true" />
              <input
                type="text"
                name="code"
                placeholder="6-digit code"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className="password-row">
              <div className="input-with-icon">
                <Lock className="field-icon" size={18} aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <>
                  <LoaderCircle className="btn-loader-icon" aria-hidden="true" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <p className="auth-switch-text">
              Need a code first? <Link to="/forgot-password">Forgot password</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
