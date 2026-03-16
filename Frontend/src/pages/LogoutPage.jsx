import { LoaderCircle } from "lucide-react";
import PageNav from "../components/PageNav.jsx";
import { routeInfo } from "../data/mockData.js";
import { useAuthStore } from "../store/useAuthStore.js";

export default function LogoutPage() {
  const { authUser, logout, isLoggingOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
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
          <h1>Logout</h1>
          <p>Frontend-only logout confirmation screen.</p>
          <ul>
            <li>{routeInfo.auth[2]}</li>
          </ul>
        </section>

        <section className="auth-card">
          <h2>Session Action</h2>
          <div className="form-stack">
            <input
              type="text"
              value={
                authUser
                  ? "You are currently signed in"
                  : "You are currently signed out"
              }
              readOnly
            />
            {authUser && (
              <button
                type="button"
                className="submit-btn"
                onClick={handleLogout}
                disabled={isLoggingOut}
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
                  "Confirm Logout"
                )}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
