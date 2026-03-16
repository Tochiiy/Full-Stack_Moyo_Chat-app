import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send, Smile, X } from "lucide-react";

const QUICK_EMOJIS = ["😀", "😂", "😍", "👍", "🔥", "🎉", "🙏", "❤️"];

export default function ChatPanel({
  activeContact,
  messages,
  isMessagesLoading,
  composer,
  selectedImage,
  onComposerChange,
  onImageSelect,
  onImageClear,
  onSend,
}) {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  const messageFlowRef = useRef(null);
  const skeletonRows = ["theirs", "mine", "theirs", "mine"];
  const canSend = Boolean(composer.trim() || selectedImage);

  useEffect(() => {
    if (messageFlowRef.current) {
      messageFlowRef.current.scrollTop = messageFlowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(String(reader.result || ""));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const addEmoji = (emoji) => {
    onComposerChange(`${composer}${emoji}`);
  };

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <div>
          <h2>{activeContact.name}</h2>
          <p>{activeContact.role}</p>
        </div>
        <div className="header-actions" aria-label="message actions">
          <button type="button">Call</button>
          <button type="button">Video</button>
        </div>
      </header>

      <div className="message-flow">
        {isMessagesLoading ? (
          skeletonRows.map((alignment, index) => (
            <article
              key={`skeleton-${index}`}
              className={`bubble-row ${alignment}`}
              aria-hidden="true"
            >
              <div className="skeleton-bubble" />
              <div className="skeleton-time" />
            </article>
          ))
        ) : (
          <>
            <p className="chat-boundary">Chat started</p>
            {messages.map((message) => (
              <article
                key={message.id}
                className={`bubble-row ${message.from === "me" ? "mine" : "theirs"}`}
              >
                <div className="bubble">
                  {message.image ? (
                    <div className="bubble-attachment">
                      <button
                        type="button"
                        className="image-preview-trigger"
                        onClick={() => setPreviewImage(message.image)}
                        aria-label="Open image preview"
                      >
                        <img
                          className="bubble-image"
                          src={message.image}
                          alt="Shared attachment"
                        />
                      </button>
                    </div>
                  ) : null}
                  {message.text ? <p>{message.text}</p> : null}
                </div>
                <span className="time">{message.time}</span>
              </article>
            ))}
          </>
        )}
      </div>

      <form className="composer" onSubmit={onSend}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="composer-file-input"
          onChange={handleImageChange}
        />
        <div className="composer-actions">
          <button
            type="button"
            className="composer-icon-btn"
            onClick={() => setIsEmojiOpen((prev) => !prev)}
            title="Add emoji"
            aria-label="Add emoji"
          >
            <Smile size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="composer-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image"
            aria-label="Upload image"
          >
            <ImagePlus size={17} aria-hidden="true" />
          </button>
        </div>
        <input
          type="text"
          value={composer}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder="Write a message..."
        />

        <button type="submit" disabled={!canSend} className="send-btn">
          <Send size={16} aria-hidden="true" />
          Send
        </button>

        {selectedImage ? (
          <div className="composer-preview">
            <button
              type="button"
              className="image-preview-trigger"
              onClick={() => setPreviewImage(selectedImage)}
              aria-label="Open selected image preview"
            >
              <img src={selectedImage} alt="Selected attachment preview" />
            </button>
            <button
              type="button"
              className="composer-preview-remove"
              onClick={onImageClear}
              aria-label="Remove selected image"
            >
              <X size={14} aria-hidden="true" />
              <span>Cancel</span>
            </button>
          </div>
        ) : null}

        {isEmojiOpen ? (
          <div
            className="emoji-popover"
            role="listbox"
            aria-label="Emoji options"
          >
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emoji-item"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}
      </form>

      {previewImage ? (
        <div
          className="image-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setPreviewImage("")}
        >
          <div
            className="image-preview-modal-body"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="image-preview-close"
              onClick={() => setPreviewImage("")}
              aria-label="Close image preview"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <img src={previewImage} alt="Full preview" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
