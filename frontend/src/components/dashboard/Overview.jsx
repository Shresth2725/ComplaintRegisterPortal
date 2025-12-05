const Overview = ({ complaints }) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const pending = total - resolved;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Complaints" value={total} color="gray" />
      <StatCard title="Resolved" value={resolved} color="green" />
      <StatCard title="Pending" value={pending} color="yellow" />
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
    <h3 className={`text-${color}-400 text-sm font-medium`}>{title}</h3>
    <p className="text-4xl font-bold text-white mt-2">{value}</p>
  </div>
);

export default Overview;
