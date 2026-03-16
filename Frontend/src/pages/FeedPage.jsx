import { Link } from "react-router-dom";
import { Bell, Flame, MessageSquare } from "lucide-react";
import PageNav from "../components/PageNav.jsx";

const feedItems = [
  {
    id: 1,
    title: "Welcome to your feed",
    text: "You are logged in. This is your personalized home with updates and quick actions.",
    icon: Flame,
  },
  {
    id: 2,
    title: "New message activity",
    text: "You have fresh chat activity waiting. Jump into conversations now.",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "Account notifications",
    text: "Profile and account alerts will show up here as your app grows.",
    icon: Bell,
  },
];

export default function FeedPage() {
  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />

      <main className="feed-layout">
        <section className="feed-hero">
          <h1>Your Feed</h1>
          <p>
            Stay updated with activity, notifications, and conversation
            highlights.
          </p>
          <div className="feed-actions">
            <Link to="/chat" className="home-btn home-btn-primary">
              Open Chat
            </Link>
            <Link to="/profile" className="home-btn home-btn-secondary">
              View Profile
            </Link>
          </div>
        </section>

        <section className="feed-list">
          {feedItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className="feed-card">
                <div className="feed-icon-wrap">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
