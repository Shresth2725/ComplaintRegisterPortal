import { useState } from "react";
import AdminComplaintCard from "./AdminComplaintCard";

const AllComplaints = ({
  complaints,
  loading,
  updatingId,
  updateComplaint,
}) => {
  const [filter, setFilter] = useState("all");

  const list = {
    all: [
      ...complaints.newComplaint,
      ...complaints.inProgressComplaint,
      ...complaints.resolvedComplaint,
    ],
    new: complaints.newComplaint,
    "in progress": complaints.inProgressComplaint,
    resolved: complaints.resolvedComplaint,
  }[filter];

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white">All Complaints</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 text-white px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* LIST */}
      {list.map((complaint) => (
        <AdminComplaintCard
          key={complaint._id}
          complaint={complaint}
          updatingId={updatingId}
          updateComplaint={updateComplaint}
        />
      ))}
    </div>
  );
};

export default AllComplaints;
