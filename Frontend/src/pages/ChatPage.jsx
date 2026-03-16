import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import LeftSidebar from "../components/LeftSidebar.jsx";
import ChatPanel from "../components/ChatPanel.jsx";
import RightPanel from "../components/RightPanel.jsx";
import PageNav from "../components/PageNav.jsx";
import { routeInfo, seedMessages } from "../data/mockData.js";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { socket } from "../lib/socket.io.js";

const PRESENCE_POLL_MS = 15000;

export default function ChatPage() {
  const { authUser } = useAuthStore();
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState("");
  const [composer, setComposer] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activePanel, setActivePanel] = useState("messages");

  // Real-time new message listener
  useEffect(() => {
    if (!activeContactId || !authUser) return;
    const handler = (data) => {
      if (data.message.recipientID === authUser._id || data.message.senderID === authUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message._id,
            from: data.message.senderID === authUser._id ? "me" : "them",
            text: data.message.text,
            image: data.message.image,
            time: data.message.createdAt
              ? new Date(data.message.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                }),
          },
        ]);
      }
    };
    socket.on("newMessage", handler);
    return () => {
      socket.off("newMessage", handler);
    };
  }, [activeContactId, authUser]);

  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get("/messages/users");
        const mappedContacts = response.data.map((user) => ({
          id: user._id,
          name: user.username,
          role: user.email,
          unread: 0,
          online: Boolean(user.online),
          lastSeen: user.lastSeen || null,
        }));

        if (!isMounted) {
          return;
        }

        setContacts(mappedContacts);
        if (!activeContactId && mappedContacts.length > 0) {
          setActiveContactId(mappedContacts[0].id);
        }
      } catch (error) {
        console.error("Error loading contacts:", error.message);
      }
    };

    fetchContacts();
    const pollTimer = setInterval(fetchContacts, PRESENCE_POLL_MS);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [activeContactId]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!activeContactId) {
        setMessages([]);
        return;
      }

      setMessagesLoading(true);
      try {
        const response = await axiosInstance.get(
          `/messages/${activeContactId}`,
        );
        const mappedMessages = response.data.map((message, index) => {
          const hasText = Boolean(message.text && message.text.trim());
          const fallbackTime = new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });

          return {
            id: message._id || `${activeContactId}-${index}`,
            from: message.senderID === authUser?._id ? "me" : "them",
            text: hasText ? message.text : "",
            image: message.image || "",
            time: message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : fallbackTime,
          };
        });

        if (!isMounted) {
          return;
        }

        setMessages(mappedMessages);
      } catch (error) {
        console.error("Error loading messages:", error.message);
        if (isMounted) {
          setMessages(seedMessages);
        }
      } finally {
        if (isMounted) {
          setMessagesLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [activeContactId, authUser?._id]);

  const activeContact = useMemo(
    () =>
      contacts.find((contact) => contact.id === activeContactId) ?? {
        id: "none",
        name: "No contact selected",
        role: "Choose a user from the list",
        unread: 0,
        online: false,
      },
    [activeContactId, contacts],
  );

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const text = composer.trim();

    if (!activeContactId) {
      toast.error("Select a contact first.");
      return;
    }

    if (!text && !selectedImage) {
      return;
    }

    try {
      const payload = {
        text,
        image: selectedImage || undefined,
      };
      const response = await axiosInstance.post(
        `/messages/send/${activeContactId}`,
        payload,
      );

      const sentMessage = response.data;
      setMessages((prev) => [
        ...prev,
        {
          id: sentMessage._id || `${Date.now()}`,
          from: "me",
          text: sentMessage.text || text,
          image: sentMessage.image || selectedImage,
          time: sentMessage.createdAt
            ? new Date(sentMessage.createdAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
            : "Now",
        },
      ]);

      setComposer("");
      setSelectedImage("");
      toast.success(`Message sent to ${activeContact.name}`);
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message || "Failed to send message");
    }
  };

  return (
    <div className="page-bg">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <PageNav />
      <main className="app-shell">
        <LeftSidebar
          contacts={contacts}
          activeContactId={activeContactId}
          onSelectContact={setActiveContactId}
        />
        <ChatPanel
          activeContact={activeContact}
          messages={messages}
          isMessagesLoading={messagesLoading}
          composer={composer}
          selectedImage={selectedImage}
          onComposerChange={setComposer}
          onImageSelect={setSelectedImage}
          onImageClear={() => setSelectedImage("")}
          onSend={handleSendMessage}
        />
        <RightPanel
          activeContact={activeContact}
        />
      </main>
    </div>
  );
}
