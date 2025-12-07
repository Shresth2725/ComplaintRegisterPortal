import { Link } from "react-router-dom";
import ComplaintCard from "./ComplaintCard";

const MyComplaints = ({ complaints, loading, setActiveTab }) => {
  if (loading) return <p className="text-slate-500 text-center py-8">Loading complaints...</p>;

  if (complaints.length === 0)
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 mb-4">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {complaints.map((c) => (
        <Link to={`/complaint-overview/${c._id}`} key={c._id}>
          <ComplaintCard complaint={c} />
        </Link>
      ))}
    </div>
  );
};

export default MyComplaints;
