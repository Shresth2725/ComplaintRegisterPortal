import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { sendMail } from "../config/email.js";
import jwt from "jsonwebtoken";

// -------------------------------------------------------------
// 1. SEND OTP (STEP 1)
// -------------------------------------------------------------
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendMail(email, "Your Verification OTP", `Your OTP is ${otp}`);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 2. VERIFY OTP (STEP 2)
// -------------------------------------------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record)
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ success: false, message: "Wrong OTP" });

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 3. CREATE ACCOUNT AFTER OTP VERIFIED (STEP 3)
// -------------------------------------------------------------
export const createAccount = async (req, res) => {
  try {
    const { fullName, email, password, address } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      address,
      isVerified: true,
      isAdmin: false,
    });

    const token = await newUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    return res.json({
      success: true,
      token,
      user: newUser,
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// LOGIN
// -------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    if (!userData)
      return res.status(404).json({ success: false, message: "No User Found" });

    const isPasswordValid = await userData.checkPassword(password);

    if (!isPasswordValid)
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });

    const token = await userData.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    res.status(201).json({
      success: true,
      user: userData,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in login API: ${error.message}`,
    });
  }
};

// -------------------------------------------------------------
// LOGOUT
// -------------------------------------------------------------
export const logout = async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in logout API: ${error.message}`,
    });
  }
};

// -------------------------------------------------------------
// UPDATE PROFILE
// -------------------------------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const { address, fullName } = req.body;
    const userID = req.user._id;

    const updateData = { address, fullName };

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      updateData.profilePic = upload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile: " + error.message,
    });
  }
};

// -------------------------------------------------------------
// CHECK AUTH
// -------------------------------------------------------------
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Google OAUTH

export const googleLogin = async (req, res) => {
  try {
    const { email, fullName, profilePic, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google login data",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // Create new user if doesn't exist
    if (!user) {
      user = await User.create({
        email,
        fullName,
        googleId,
        profilePic,
        isGoogleUser: true,
        isVerified: true, // Google verifies email already
      });
    }

    // Create a JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};
