import User from "../../models/user.model.js";
import Message from "../../models/message.model.js";
import cloudinary from "../../lib/cloudinary.js";

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    const now = Date.now();
    const usersWithPresence = filteredUsers.map((user) => {
      const userData = user.toObject();
      const lastSeenMs = userData.lastSeen
        ? new Date(userData.lastSeen).getTime()
        : 0;

      return {
        ...userData,
        online: now - lastSeenMs <= ONLINE_WINDOW_MS,
      };
    });

    res.status(200).json(usersWithPresence);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const senderID = req.user._id;
    // Fetch messages between the logged-in user and the specified user
    const messages = await Message.find({
      $or: [
        { senderID: senderID, recipientID: userToChatID },
        { senderID: userToChatID, recipientID: senderID },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recipientID } = req.params;
    const senderID = req.user._id;

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderID,
      recipientID,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // real time communication can be implemented here using WebSockets (e.g., Socket.IO) to emit the new message to the recipient immediately after saving it to the database.
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
