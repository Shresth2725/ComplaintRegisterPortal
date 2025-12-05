import ComplaintCard from "./ComplaintCard";

const MyComplaints = ({ complaints, loading, setActiveTab }) => {
  if (loading) return <p className="text-gray-400">Loading complaints...</p>;

  if (complaints.length === 0)
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-gray-400">
          No complaints found. Start by creating one!
        </p>
        <button
          onClick={() => setActiveTab("new-complaint")}
          className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white"
        >
          Create Complaint
        </button>
      </div>
    );

  return (
    <div className="grid gap-6">
      {complaints.map((c) => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </div>
  );
};

export default MyComplaints;
