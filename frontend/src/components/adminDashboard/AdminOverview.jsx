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
    { name: "New", value: complaints.newComplaint.length, color: "#3B82F6" }, // Blue
    {
      name: "In Progress",
      value: complaints.inProgressComplaint.length,
      color: "#F59E0B", // Amber
    },
    {
      name: "Resolved",
      value: complaints.resolvedComplaint.length,
      color: "#10B981", // Green
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

  const ratedComplaints = complaints.resolvedComplaint.filter(
    (c) => c.rating > 0
  );

  const rawAvgRating =
    ratedComplaints.length > 0
      ? ratedComplaints.reduce((acc, c) => acc + c.rating, 0) /
      ratedComplaints.length
      : 0;

  const avgRating = rawAvgRating > 0 ? rawAvgRating.toFixed(1) : "N/A";

  // Data for Gauge Chart (Customer Satisfaction)
  const gaugeData = [
    { name: "Score", value: rawAvgRating, color: rawAvgRating >= 4 ? "#10B981" : rawAvgRating >= 3 ? "#F59E0B" : "#EF4444" },
    { name: "Remaining", value: 5 - rawAvgRating, color: "#E2E8F0" },
  ];

  const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Overview of system performance and complaints.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total" value={total} color="slate" />
        <StatCard
          title="New"
          value={complaints.newComplaint.length}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={complaints.inProgressComplaint.length}
          color="amber"
        />
        <StatCard
          title="Resolved"
          value={complaints.resolvedComplaint.length}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PIE CHART */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={0}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GAUGE CHART (RATING) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 self-start w-full">Satisfaction</h2>
          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={gaugeData[0].color} />
                  <Cell fill={gaugeData[1].color} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pb-4">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{avgRating}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">/ 5.0</span>
            </div>
          </div>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">
            Based on {ratedComplaints.length} ratings
          </p>
        </div>

        {/* CATEGORY BAR CHART */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Categories</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="displayName" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
