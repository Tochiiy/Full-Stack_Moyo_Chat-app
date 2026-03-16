import { Link } from "react-router-dom";
import PageNav from "../components/PageNav.jsx";

export default function HomepagePage() {
  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="home-layout">
        <section className="home-hero">
          <img src="/moyochat-logo.svg" alt="MoyoChat" className="home-logo" />
          <h1>Connect, chat, and collaborate in one place</h1>
          <p>
            MoyoChat helps teams and friends exchange messages instantly with a
            simple, focused interface.
          </p>
          <div className="home-actions">
            <Link to="/login" className="home-btn home-btn-primary">
              Go to Login
            </Link>
            <Link to="/signup" className="home-btn home-btn-secondary">
              Create Account
            </Link>
          </div>
        </section>

        <section className="home-card skeleton-card">
          <h2>Live Conversations Preview</h2>
          <p>Loading conversation highlights...</p>
          <div className="skeleton-block" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line long" />
        </section>

        <section className="home-card community-card">
          <h2>Join Our Community</h2>
          <p>
            Be part of a fast-growing network of builders, friends, and teams
            using MoyoChat every day.
          </p>
          <Link to="/signup" className="home-btn home-btn-primary">
            Join Now
          </Link>
        </section>
      </main>
    </div>
  );
}
