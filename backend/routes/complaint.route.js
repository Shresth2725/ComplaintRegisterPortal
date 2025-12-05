import express from "express";
import {
  createComplaint,
  filterComplaintOnStateCity,
  getAllComplaints,
  getMyComplaint,
  updateAfterImageUrl,
  updateComplaint,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploads.js";

const complaintRouter = express.Router();

complaintRouter.post(
  "/create-complaint",
  protectRoute,
  upload.single("beforeImageUrl"),
  createComplaint
);

complaintRouter.get("/get-complaints", protectRoute, getMyComplaint);

complaintRouter.get("/get-all-complaints", protectRoute, getAllComplaints);

complaintRouter.post(
  "/update-complaint-status/:id",
  protectRoute,
  updateComplaintStatus
);

complaintRouter.get(
  "/fetch-complaints-city-state",
  protectRoute,
  filterComplaintOnStateCity
);

complaintRouter.post(
  "/upload-after-image/:id",
  protectRoute,
  upload.single("afterImageUrl"),
  updateAfterImageUrl
);

complaintRouter.post(
  "/update-complaint-status-upload-image/:id",
  protectRoute,
  upload.single("afterImageUrl"),
  updateComplaint
);

export default complaintRouter;
