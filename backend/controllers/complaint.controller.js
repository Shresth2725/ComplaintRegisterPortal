import { log } from "console";
import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js";
import fs from "fs";
import {
  roadKeywords,
  garbageKeywords,
  waterKeywords,
  electricityKeywords,
  treeKeywords,
  fireKeywords,
  accidentKeywords,
  noiseKeywords,
  hasKeyword,
} from "../config/constants.js";
import { sendMail } from "../config/email.js";

// Create a Complaint
export const createComplaint = async (req, res) => {
  try {
    const { description, latitude, longitude, city, state, landmark, status } =
      req.body;

    if (
      !description ||
      !latitude ||
      !longitude ||
      !city ||
      !state ||
      !landmark
    ) {
      return res.status(404).json({
        success: false,
        message: "All details are required",
      });
    }

    let beforeImageUrl = "";
    let detectedCategory = "other";

    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          categorization: "google_tagging",
          auto_tagging: 0.7,
        });

        beforeImageUrl = upload.secure_url;

        const tags =
          upload.info?.categorization?.google_tagging?.data?.map((t) =>
            t.tag.toLowerCase()
          ) || [];

        console.log("Detected Tags:", tags);

        if (hasKeyword(tags, roadKeywords)) detectedCategory = "road_damage";
        else if (hasKeyword(tags, garbageKeywords))
          detectedCategory = "garbage_issue";
        else if (hasKeyword(tags, waterKeywords))
          detectedCategory = "water_leakage";
        else if (hasKeyword(tags, electricityKeywords))
          detectedCategory = "electricity_issue";
        else if (hasKeyword(tags, treeKeywords))
          detectedCategory = "tree_fallen";
        else if (hasKeyword(tags, fireKeywords)) detectedCategory = "fire";
        else if (hasKeyword(tags, accidentKeywords))
          detectedCategory = "accident";
        else if (hasKeyword(tags, noiseKeywords))
          detectedCategory = "noise_issue";

        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: `Error uploading image to Cloudinary: ${error.message}`,
        });
      }
    }

    // SAVE COMPLAINT
    const newComplaint = await Complaint.create({
      user: req.user._id,
      description,
      latitude,
      longitude,
      city,
      state,
      landmark,
      beforeImageUrl,
      category: detectedCategory,
      status: "new",
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Error in create complaint API: ${error.message}`,
    });
  }
};

// Get LoggedIn User complaints
export const getMyComplaint = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).populate(
      "user"
    );
    if (!complaints) {
      return res
        .status(404)
        .json({ success: false, message: "No Complaints found" });
    }

    res.status(201).json({
      success: true,
      message: "Fetched all the user complaints",
      complaints,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: `Error in getUserComplaint API: ${error.message}`,
    });
  }
};

// get All Complaints - ADMIN
export const getAllComplaints = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Only Admin can access this API" });
    }

    const complaints = await Complaint.find().populate("user");

    if (!complaints) {
      return res
        .status(404)
        .json({ success: false, message: "No Complaints Found" });
    }

    const newComplaint = complaints.filter(
      (complaint) => complaint.status === "new"
    );

    const inProgressComplaint = complaints.filter(
      (complaint) => complaint.status === "in progress"
    );

    const resolvedComplaint = complaints.filter(
      (complaint) => complaint.status === "resolved"
    );

    res.status(201).json({
      success: true,
      message: "Fetch all the complaints",
      complaints: { newComplaint, inProgressComplaint, resolvedComplaint },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: `Error in Get All Complaints API: ${error.message}`,
    });
  }
};

// Filter Complaints on base of state/city - ADMIN (first way)
// export const filterComplaintOnStateCity = async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res
//         .status(401)
//         .json({ success: false, message: "You are not a admin" });
//     }

//     const state = req.body.state?.toLowerCase();
//     const city = req.body.city?.toLowerCase();

//     if (!state && !city) {
//       return res
//         .status(404)
//         .json({ success: true, message: "Need to provider state or city" });
//     }

//     let complaints;

//     if (state) {
//       complaints = await Complaint.find({ state }).populate("user");

//       if (!complaints || complaints.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "No complaints within this state" });
//       }
//     } else {
//       complaints = await Complaint.find({ city }).populate("user");

//       if (!complaints || complaints.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "No complaints within this city" });
//       }
//     }

//     res.status(201).json({
//       success: true,
//       message: "Complaint fetched successfully",
//       complaints,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(501).json({
//       success: false,
//       message: `Error in filter complaint based on state and city API: ${error.message}`,
//     });
//   }
// };

// Filter Complaints on base of state/city - ADMIN (second way)
export const filterComplaintOnStateCity = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "You are not an admin",
      });
    }

    const state = (req.body.state || "").toLowerCase();
    const city = (req.body.city || "").toLowerCase();

    if (!state && !city) {
      return res.status(400).json({
        success: false,
        message: "You must provide state or city",
      });
    }

    let fetchField;
    let fetchValue;

    if (state) {
      fetchField = "state";
      fetchValue = state;
    } else {
      fetchField = "city";
      fetchValue = city;
    }

    const query = { [fetchField]: fetchValue };

    const complaints = await Complaint.find(query).populate("user");

    if (!complaints.length) {
      return res.status(404).json({
        success: false,
        message: `No complaints for this ${fetchField}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

// Update complaint status - ADMIN
export const updateComplaintStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "You are not a Admin" });
    }

    const complaintId = req.params.id;
    const { status } = req.body;

    if (!["new", "in progress", "resolved"].includes(status)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid  status value" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    if (status === "resolved" && !complaint.afterImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Cannot resolve complaint without an after image",
      });
    }

    const updateComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Complaint status updated",
      updateComplaint,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: `Error in update complaint status API: ${error.message}`,
    });
  }
};

// Update the afterImageUrl when status is resolved - ADMIN
export const updateAfterImageUrl = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "You are not a admin" });
    }

    const complaintId = req.params.id;

    if (!complaintId) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide a complaintId" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "No complaint found" });
    }

    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide a image" });
    }

    let imageUrl;
    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path);

        imageUrl = upload.secure_url;

        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: `Error while uploading the image to cloudinary: ${error.message}`,
        });
      }
    }

    complaint.afterImageUrl = imageUrl;
    complaint.status = "resolved";

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "After Image uploaded successfully",
      complaint,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: `Error in update AfterImageUrl API: ${error.message}`,
    });
  }
};

// Update image and status - ADMIN
export const updateComplaint = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }

    const complaintId = req.params.id;
    const { status } = req.body;

    const complaint = await Complaint.findById(complaintId).populate("user");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Validate status (if provided)
    if (
      status &&
      !["new", "in progress", "resolved"].includes(status.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // ---------------------------
    // 1. HANDLE IMAGE UPLOAD
    // ---------------------------
    if (req.file) {
      try {
        const uploaded = await cloudinary.uploader.upload(req.file.path);
        complaint.afterImageUrl = uploaded.secure_url;

        // Cleanup temp file
        fs.unlinkSync(req.file.path);

        // Auto-resolve if image uploaded
        complaint.status = "resolved";
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed: " + error.message,
        });
      }
    }

    // ---------------------------
    // 2. HANDLE STATUS UPDATE
    // (only when NO file is uploaded)
    // ---------------------------
    if (!req.file && status) {
      complaint.status = status.toLowerCase();
    }

    // Save updates
    await complaint.save();

    // Send email after resolved
    if (complaint.status === "resolved") {
      await sendMail(
        complaint.user.email,
        "Your Complaint Has Been Resolved",
        `Hello ${complaint.user.fullName}, your complaint "${complaint.description}" has been resolved.`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating complaint: " + error.message,
    });
  }
};

// Get Complaint Details
export const getComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId).populate("user");

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "No complaint found" });
    }

    res.status(201).json({
      success: true,
      message: "Complaint data fetched successfully",
      complaint,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: `Error in get complaiant data API: ${error.message}`,
    });
  }
};
