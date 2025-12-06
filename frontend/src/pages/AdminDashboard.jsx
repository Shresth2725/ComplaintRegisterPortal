import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState({
    newComplaint: [],
    inProgressComplaint: [],
    resolvedComplaint: [],
  });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data?.isAdmin) navigate("/dashboard");
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/get-all-complaints");
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load complaints" });
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // ---------------------------------------------------
  // UNIFIED UPDATE FUNCTION (status + image)
  // ---------------------------------------------------
  const updateComplaint = async (id, status, file) => {
    const formData = new FormData();
    if (status) formData.append("status", status);
    if (file) formData.append("imageUrl", file);

    setUpdatingId(id);

    try {
      const res = await API.post(
        `/complaint/update-complaint-status-upload-image/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Complaint updated!" });
        await fetchComplaints();
      }
    } catch {
      setMessage({ type: "error", text: "Update failed" });
    }

    setUpdatingId(null);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {["overview", "complaints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {tab === "overview" ? "📊 Overview" : "📋 All Complaints"}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full mb-4 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-slate-900 to-purple-900/10 overflow-y-auto">
        {message.text && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {message.text}
          </div>
        )}

        {activeTab === "overview" && (
          <AdminOverview complaints={complaints} loading={loading} />
        )}

        {activeTab === "complaints" && (
          <AllComplaints
            complaints={complaints}
            loading={loading}
            updatingId={updatingId}
            updateComplaint={updateComplaint}
          />
        )}
      </main>
    </div>
  );
};

// =======================================================================
// OVERVIEW COMPONENT — includes Pie & Category Bar Charts
// =======================================================================
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

  // CATEGORY ANALYTICS
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

  const colors = [
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#3B82F6",
    "#6366F1",
    "#EF4444",
    "#14B8A6",
  ];

  return (
    <>
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h1 className="text-3xl text-white">Admin Dashboard</h1>
      </div>

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

      {/* Pie Chart */}
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
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h2 className="text-xl text-white mb-4">Complaints by Category</h2>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="displayName"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <Tooltip />
              <Legend />

              <Bar dataKey="count" name="Complaints" radius={[5, 5, 0, 0]}>
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

const StatCard = ({ title, value, color }) => (
  <div className="bg-white/10 p-6 rounded-xl shadow">
    <h3 className={`text-${color}-400 text-sm`}>{title}</h3>
    <p className="text-4xl text-white font-bold">{value}</p>
  </div>
);

// =======================================================================
// ALL COMPLAINTS COMPONENT
// =======================================================================
const AllComplaints = ({
  complaints,
  loading,
  updatingId,
  updateComplaint,
}) => {
  const [filter, setFilter] = useState("all");

  const list = {
    all: [
      ...complaints.newComplaint,
      ...complaints.inProgressComplaint,
      ...complaints.resolvedComplaint,
    ],
    new: complaints.newComplaint,
    "in progress": complaints.inProgressComplaint,
    resolved: complaints.resolvedComplaint,
  }[filter];

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white">All Complaints</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 text-white px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {list.map((c) => (
        <div key={c._id} className="bg-white/5 p-6 rounded-xl relative">
          {updatingId === c._id && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
              Updating...
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Images */}
            <div className="md:w-1/4 space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Before Image:</p>
                <img
                  src={c.beforeImageUrl}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {c.afterImageUrl && (
                <div>
                  <p className="text-xs text-green-400 mb-1">After Image:</p>
                  <img
                    src={c.afterImageUrl}
                    className="w-full h-48 object-cover rounded-lg border-2 border-green-500/40"
                  />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="text-xl text-white font-semibold">
                {c.category?.replace("_", " ").toUpperCase()}
              </h3>

              <p className="text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>

              <p className="text-gray-300 mt-3">{c.description}</p>

              <div className="flex gap-4 my-3 text-gray-400">
                <p>
                  📍 {c.city}, {c.state}
                </p>
                <p>🏢 {c.landmark}</p>
              </div>

              {/* STATUS + IMAGE UPLOAD */}
              <div className="mt-4 flex items-center gap-4">
                {/* Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.status === "resolved"
                      ? "bg-green-500/20 text-green-400"
                      : c.status === "in progress"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>

                {/* STATUS SELECT */}
                <select
                  value={c.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;

                    // RULE: Admin cannot set resolved without AFTER IMAGE
                    if (newStatus === "resolved" && !c.afterImageUrl) {
                      alert(
                        "Please upload resolution image before marking as resolved."
                      );
                      return;
                    }

                    updateComplaint(c._id, newStatus, null);
                  }}
                  className="bg-slate-800 text-white px-3 py-2 rounded"
                >
                  <option value="new">New</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                {/* IMAGE UPLOAD */}
                {c.status !== "resolved" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateComplaint(c._id, null, e.target.files[0])
                    }
                    className="text-gray-300"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
