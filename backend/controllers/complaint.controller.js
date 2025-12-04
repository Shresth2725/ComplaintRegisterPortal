import { log } from "console";
import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js";
import fs from "fs";

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
      !landmark ||
      !status
    ) {
      return res
        .status(404)
        .json({ success: false, message: "All details are required" });
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

    const newComplaint = await Complaint.create({
      user: req.user._id,
      description,
      landmark,
      latitude,
      longitude,
      city,
      state,
      imageUrl,
      status: "New",
    });

    res.status(201).json({
      success: true,
      message: `Complaint submitted successfully`,
      complaint: newComplaint,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
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
      (complaint) => complaint.status === "New"
    );

    const inProgressComplaint = complaints.filter(
      (complaint) => complaint.status === "In Progress"
    );

    const resolvedComplaint = complaints.filter(
      (complaint) => complaint.status === "Resolved"
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

    if (!["New", "In Progress", "Resolved"].includes(status)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid  status value" });
    }

    const updateComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updateComplaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

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