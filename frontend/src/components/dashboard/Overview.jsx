import MyComplaints from "./MyComplaints";

const Overview = ({ complaints, loading, setActiveTab }) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const pending = total - resolved;

  return (
    <>
      {/* Title Section */}
      <div
        className="
          bg-gradient-to-br from-white/10 to-white/5 
          border border-white/20 
          p-6 rounded-2xl shadow-lg 
          backdrop-blur-md mb-6
          hover:shadow-xl hover:scale-[1.01]
          transition-all duration-300 ease-out
        "
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Your Complaints Overview
        </h1>
        <p className="text-gray-300 text-sm mt-1">
          Track the status and progress of all the issues you've reported.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Complaints" value={total} color="gray" />
        <StatCard title="Resolved" value={resolved} color="green" />
        <StatCard title="Pending" value={pending} color="yellow" />
      </div>

      {/* Complaints List */}
      <MyComplaints
        complaints={complaints}
        loading={loading}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

const StatCard = ({ title, value, color }) => (
  <div
    className="
      bg-gradient-to-br from-white/10 to-white/5 
      border border-white/20 
      p-6 rounded-2xl shadow-lg 
      backdrop-blur-md 
      hover:shadow-xl hover:scale-[1.02]
      transition-all duration-300 ease-out
    "
  >
    <h3 className={`text-${color}-300 text-sm font-semibold tracking-wide`}>
      {title}
    </h3>
    <p className="text-4xl font-extrabold text-white mt-3">{value}</p>
  </div>
);

export default Overview;
