import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import StatCard from "./StatCard";

const AdminOverview = ({ complaints }) => {
  const total =
    complaints.newComplaint.length +
    complaints.inProgressComplaint.length +
    complaints.resolvedComplaint.length;

  const pieData = [
    { name: "New", value: complaints.newComplaint.length, color: "#EF4444" },
    {
      name: "In Progress",
      value: complaints.inProgressComplaint.length,
      color: "#EAB308",
    },
    {
      name: "Resolved",
      value: complaints.resolvedComplaint.length,
      color: "#22C55E",
    },
  ];

  const all = [
    ...complaints.newComplaint,
    ...complaints.inProgressComplaint,
    ...complaints.resolvedComplaint,
  ];

  const categoryData = Object.values(
    all.reduce((acc, c) => {
      const category = c.category || "other";
      if (!acc[category]) acc[category] = { name: category, count: 0 };
      acc[category].count++;
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    displayName: item.name.replace(/_/g, " ").toUpperCase(),
  }));

  const colors = ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];

  return (
    <>
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h1 className="text-3xl text-white">Admin Dashboard</h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total" value={total} color="gray" />
        <StatCard
          title="New"
          value={complaints.newComplaint.length}
          color="red"
        />
        <StatCard
          title="In Progress"
          value={complaints.inProgressComplaint.length}
          color="yellow"
        />
        <StatCard
          title="Resolved"
          value={complaints.resolvedComplaint.length}
          color="green"
        />
      </div>

      {/* PIE CHART */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h2 className="text-xl text-white mb-4">Complaints Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY BAR CHART */}
      <div className="bg-white/10 p-6 rounded-xl">
        <h2 className="text-xl text-white mb-4">Complaints by Category</h2>

        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="displayName" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {categoryData.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
