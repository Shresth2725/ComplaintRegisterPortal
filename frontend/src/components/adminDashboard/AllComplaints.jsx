import { useState } from "react";
import AdminComplaintCard from "./AdminComplaintCard";
import { Link } from "react-router-dom";

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

  if (loading) return <p className="text-slate-500 text-center py-8">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">All Complaints</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* LIST */}
      <div className="grid gap-6">
        {list.length > 0 ? (
          list.map((complaint) => (
            <Link to={`/admin/complaint-overview/${complaint._id}`} key={complaint._id}>
              <AdminComplaintCard
                complaint={complaint}
              />
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500">No complaints found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllComplaints;
