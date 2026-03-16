export default function RightPanel({
  activeContact,
}) {
  return (
    <aside className="right-panel">
      <div className="profile-card">
        <span className="big-avatar">{activeContact.name[0]}</span>
        <h3>{activeContact.name}</h3>
        <p>{activeContact.role}</p>
      </div>
    </aside>
  );
}
