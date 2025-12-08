import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ComplaintCard from "./ComplaintCard";
import API from "../../api/axios";

const MyComplaints = ({ setActiveTab }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/complaint/my-list?page=${page}&limit=10&status=${filter}`
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
    return <p className="text-slate-500 dark:text-slate-400 text-center py-8">Loading complaints...</p>;

  if (!loading && complaints.length === 0 && filter === "all")
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          No complaints found. Start by creating one!
        </p>
        <button
          onClick={() => setActiveTab("new-complaint")}
          className="px-6 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white font-medium transition-colors"
        >
          Create Complaint
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Complaints</h2>

        <select
          value={filter}
          onChange={handleFilterChange}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8 col-span-2">Loading...</p>
        ) : complaints.length > 0 ? (
          complaints.map((c) => (
            <Link to={`/complaint-overview/${c._id}`} key={c._id}>
              <ComplaintCard complaint={c} />
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-2 transition-colors">
            <p className="text-slate-500 dark:text-slate-400">No complaints found for this filter.</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border transition-colors ${page === 1
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border transition-colors ${page === totalPages
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
