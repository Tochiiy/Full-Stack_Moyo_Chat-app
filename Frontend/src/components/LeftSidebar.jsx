export default function LeftSidebar({
  contacts,
  activeContactId,
  onSelectContact,
}) {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) {
      return "Offline";
    }

    const diffMs = Date.now() - new Date(lastSeen).getTime();
    if (Number.isNaN(diffMs) || diffMs < 0) {
      return "Offline";
    }

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {
      return "Last seen just now";
    }
    if (diffMins < 60) {
      return `Last seen ${diffMins} min ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    return `Last seen ${diffHours} hr ago`;
  };

  return (
    <aside className="left-panel">
      <div className="brand-row">
        <img src="/moyochat-logo.svg" alt="MoyoChat" className="brand-logo" />
      </div>
      <p className="panel-subtitle">chats</p>
      <div className="search-box">
        <input type="text" placeholder="Search friends" readOnly />
      </div>
      <ul className="contact-list">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              className={`contact-card ${activeContactId === contact.id ? "active" : ""}`}
              onClick={() => onSelectContact(contact.id)}
            >
              <span className="avatar">{contact.name[0]}</span>
              <span className="contact-meta">
                <strong>{contact.name}</strong>
                <small>
                  {contact.online ? "Online" : formatLastSeen(contact.lastSeen)}
                </small>
              </span>
              {contact.unread > 0 && (
                <span className="badge">{contact.unread}</span>
              )}
              <span
                className={contact.online ? "online-dot" : "offline-dot"}
                title={contact.online ? "online" : "offline"}
              />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
