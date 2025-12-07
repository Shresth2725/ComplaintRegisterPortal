import MyComplaints from "./MyComplaints";

const Overview = ({ complaints, loading, setActiveTab }) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const pending = total - resolved;

  return (
    <>
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Overview
        </h1>
        <p className="text-slate-600 mt-1">
          Track the status and progress of your reported issues.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Complaints" value={total} color="blue" />
        <StatCard title="Resolved" value={resolved} color="green" />
        <StatCard title="Pending" value={pending} color="amber" />
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

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} shadow-sm`}>
      <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Overview;
