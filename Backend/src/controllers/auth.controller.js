import { generateToken } from "../../lib/utilitis.js";
import cloudinary from "../../lib/cloudinary.js";
import { sendResetCodeEmail } from "../../lib/email.js";
import User from "../../models/user.model.js";
import bcrypt from "bcrypt";

const RESET_CODE_TTL_MS = 15 * 60 * 1000;

const generateResetCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        createdAt: newUser.createdAt,
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password are required" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: "Login successful",
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(profilePicture);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResult.secure_url },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Check auth error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If an account exists for this email, a reset code was sent.",
      });
    }

    const resetCode = generateResetCode();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + RESET_CODE_TTL_MS);
    await user.save();

    await sendResetCodeEmail({
      toEmail: user.email,
      username: user.username,
      resetCode,
    });

    return res.status(200).json({
      message: "If an account exists for this email, a reset code was sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      message: "Unable to send reset code email. Check SMTP credentials.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, code and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res
        .status(400)
        .json({
          message: "Password must include at least one letter and one number",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const isCodeExpired =
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now();

    if (
      !user.resetPasswordCode ||
      user.resetPasswordCode !== code ||
      isCodeExpired
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
