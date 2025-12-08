import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import AdminOverview from "../components/adminDashboard/AdminOverview";
import AllComplaints from "../components/adminDashboard/AllComplaints";
import AdminChats from "../components/adminDashboard/AdminChats";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminDashboardActiveTab") || "overview"
  );

  useEffect(() => {
    localStorage.setItem("adminDashboardActiveTab", activeTab);
  }, [activeTab]);
  const [stats, setStats] = useState({
    newComplaint: [],
    inProgressComplaint: [],
    resolvedComplaint: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data?.isAdmin) navigate("/dashboard");
    if (!data?.isAdmin) navigate("/dashboard");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/admin/stats");
      if (res.data.success) setStats(res.data.stats);
    } catch {
      setMessage({ type: "error", text: "Failed to load stats" });
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {["overview", "complaints", "chats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === tab
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {tab === "overview" && "📊 Overview"}
              {tab === "complaints" && "📋 All Complaints"}
              {tab === "chats" && "💬 Chats"}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-sm font-medium shadow-sm"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        {/* Toast Message */}
        {message.text && (
          <div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${message.type === "success" ? "bg-green-600" : "bg-red-600"
              } text-white font-medium`}
          >
            {message.text}
          </div>
        )}

        {/* TABS */}
        {activeTab === "overview" && (
          <AdminOverview complaints={stats} loading={loading} />
        )}

        {activeTab === "complaints" && (
          <AllComplaints />
        )}

        {activeTab === "chats" && (
          <AdminChats />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
