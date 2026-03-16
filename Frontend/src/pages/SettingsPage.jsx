import PageNav from "../components/PageNav.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { logout, isLoggingOut, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!authUser || isLoggingOut) {
      return;
    }

    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      // Toast is handled in store; keep page state unchanged on failure.
    }
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="auth-layout">
        <section className="auth-card">
          <h1>Settings</h1>
          <p>Frontend-only settings page for interface preferences.</p>
          <ul>
            <li>Theme preview</li>
            <li>Notification toggles</li>
            <li>Privacy options</li>
          </ul>
        </section>

        <section className="auth-card">
          <h2>Preferences</h2>
          <div className="form-stack">
            <input type="text" value="Notifications: Enabled" readOnly />
            <input type="text" value="Language: English" readOnly />
            <button type="button">Save Preferences</button>
          </div>

          <div className="settings-logout-wrap">
            <h2>Account</h2>
            <p>Sign out from your account from settings.</p>
            <button
              type="button"
              className="settings-logout-btn"
              onClick={handleLogout}
              disabled={!authUser || isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <LoaderCircle
                    className="btn-loader-icon"
                    aria-hidden="true"
                  />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="nav-icon" aria-hidden="true" />
                  Logout
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
