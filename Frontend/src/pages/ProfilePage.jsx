import PageNav from "../components/PageNav.jsx";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, LoaderCircle } from "lucide-react";

export default function ProfilePage() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(
    authUser?.profilePicture || "",
  );
  const fileInputRef = useRef(null);

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const initials = (authUser?.username || "U").slice(0, 1).toUpperCase();

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || isUpdatingProfile) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setPreviewImage(base64Image);
      try {
        await updateProfile({ profilePicture: base64Image });
      } catch {
        // Toast feedback is handled by the store action.
      }
    };
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="auth-layout">
        <section className="auth-card profile-main-card">
          <h1>Profile</h1>
          <p>Manage your account photo and personal details.</p>

          <div className="profile-avatar-wrap">
            {previewImage || authUser?.profilePicture ? (
              <img
                src={previewImage || authUser?.profilePicture}
                alt="Profile"
                className="profile-avatar-circle"
              />
            ) : (
              <div className="profile-avatar-circle profile-avatar-fallback">
                {initials}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-file-input"
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
          <button
            type="button"
            className="profile-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <LoaderCircle className="btn-loader-icon" aria-hidden="true" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="nav-icon" aria-hidden="true" />
                Upload Picture
              </>
            )}
          </button>

          {isUpdatingProfile && (
            <div
              className="profile-update-loader"
              role="status"
              aria-live="polite"
            >
              <LoaderCircle
                className="profile-update-loader-icon"
                aria-hidden="true"
              />
              <span>Updating profile image...</span>
            </div>
          )}
        </section>

        <section className="auth-card">
          <h2>Account Information</h2>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span>Username</span>
              <strong>{authUser?.username || "Not available"}</strong>
            </div>
            <div className="profile-info-item">
              <span>Email</span>
              <strong>{authUser?.email || "Not available"}</strong>
            </div>
            <div className="profile-info-item">
              <span>Status</span>
              <strong className="profile-status-live">Active</strong>
            </div>
            <div className="profile-info-item">
              <span>Member Since</span>
              <strong>{memberSince}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
