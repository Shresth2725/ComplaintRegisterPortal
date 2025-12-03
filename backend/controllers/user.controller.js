import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// SignUp
export const signup = async (req, res) => {
  const { fullName, email, password, address } = req.body;

  try {
    if (!fullName || !email || !password || !address) {
      return res
        .status(404)
        .json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(404)
        .json({ success: false, message: "Account already existed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      address,
      isAdmin: false,
    });

    const token = await newUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 1 * 3600000),
    });

    res.status(201).json({
      success: true,
      userData: newUser,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: `Error in signup API: ${error.message}`,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(404).json({ success: false, message: "No User Found" });
    }

    if (isAdmin && !userData.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }

    const isPasswordValid = await userData.checkPassword(password);

    if (!isPasswordValid) {
      return res
        .status(404)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = await userData.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 1 * 3600000),
    });

    res.status(201).json({
      success: true,
      user: userData,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: `Error in login API: ${error.message}`,
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "No token found" });
    }

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(201).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Error in logout API: ${error.message}`,
    });
  }
};

// update
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
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating profile: " + error.message,
    });
  }
};
