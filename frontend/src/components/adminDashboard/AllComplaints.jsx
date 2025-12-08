import { useState, useEffect } from "react";
import AdminComplaintCard from "./AdminComplaintCard";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/complaint/admin/list?page=${page}&limit=10&status=${filter}`
      );
      if (res.data.success) {
        setComplaints(res.data.complaints);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading && page === 1 && complaints.length === 0)
    return <p className="text-slate-500 text-center py-8">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">All Complaints</h2>

        <select
          value={filter}
          onChange={handleFilterChange}
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
        {loading ? (
          <p className="text-slate-500 text-center py-8">Loading...</p>
        ) : complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Link
              to={`/admin/complaint-overview/${complaint._id}`}
              key={complaint._id}
            >
              <AdminComplaintCard complaint={complaint} />
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500">No complaints found for this filter.</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border ${page === 1
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
          >
            Previous
          </button>
          <span className="text-slate-600 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border ${page === totalPages
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllComplaints;
