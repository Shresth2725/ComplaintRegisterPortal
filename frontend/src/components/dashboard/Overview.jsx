import MyComplaints from "./MyComplaints";

const Overview = ({ stats, loading, setActiveTab }) => {
  const { total, newComplaint, inProgressComplaint, resolvedComplaint } = stats;

  return (
    <>
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track the status and progress of your reported issues.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Complaints" value={total} color="blue" />
        <StatCard title="Resolved" value={resolvedComplaint} color="green" />
        <StatCard title="Pending" value={newComplaint + inProgressComplaint} color="amber" />
      </div>

      {/* Complaints List */}
      <MyComplaints
        setActiveTab={setActiveTab}
      />
    </>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/30",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/30",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} shadow-sm transition-colors`}>
      <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Overview;
