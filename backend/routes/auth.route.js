import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploads.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check-auth", protectRoute, checkAuth);

// Protected Routes
authRouter.post(
  "/update",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

export default authRouter;
