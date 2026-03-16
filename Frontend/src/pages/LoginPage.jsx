import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, User } from "lucide-react";
import toast from "react-hot-toast";
import PageNav from "../components/PageNav.jsx";
import { routeInfo } from "../data/mockData.js";
import { useAuthStore } from "../store/useAuthStore.js";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      toast.error("Email or username and password are required.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must include at least one letter and one number.");
      return;
    }

    const isEmail = formData.identifier.includes("@");
    const payload = {
      ...(isEmail
        ? { email: formData.identifier.trim() }
        : { username: formData.identifier.trim() }),
      password: formData.password,
    };

    try {
      await login(payload);
    } catch {
      // Error toast is handled in store.
    }
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="auth-layout">
        <section className="auth-card">
          <h1>Welcome Back</h1>
          <p>Frontend-only login page mapped to your auth route.</p>
          <ul>
            <li>{routeInfo.auth[1]}</li>
          </ul>
        </section>

        <section className="auth-card">
          <h2>Login Form</h2>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="input-with-icon">
              <User className="field-icon" size={18} aria-hidden="true" />
              <input
                type="text"
                name="identifier"
                placeholder="Email or username"
                value={formData.identifier}
                onChange={handleChange}
              />
            </div>

            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <LoaderCircle
                    className="btn-loader-icon"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="auth-switch-text">
              Forgot your password? <Link to="/forgot-password">Reset it</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
