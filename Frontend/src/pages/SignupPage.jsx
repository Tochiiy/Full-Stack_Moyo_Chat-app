import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import PageNav from "../components/PageNav.jsx";
import { routeInfo } from "../data/mockData.js";
import { useAuthStore } from "../store/useAuthStore.js";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { username, email, password } = formData;

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email format.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must include at least one letter and one number.");
      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      await signup(formData);
    } catch (error) {
      console.error(
        "Signup failed:",
        error?.response?.data?.message || error.message,
      );
    }
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="auth-layout">
        <section className="auth-card">
          <h1>Create Account</h1>
          <p>Frontend-only signup page mapped to your auth route.</p>
          <ul>
            <li>{routeInfo.auth[0]}</li>
          </ul>
        </section>

        <section className="auth-card">
          <h2>Signup Form</h2>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="input-with-icon">
              <User className="field-icon" size={18} aria-hidden="true" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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

            <div className="password-row">
              <div className="input-with-icon">
                <Lock className="field-icon" size={18} aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
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

            <button type="submit" className="submit-btn" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <LoaderCircle
                    className="btn-loader-icon"
                    aria-hidden="true"
                  />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="auth-switch-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
