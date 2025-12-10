import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";
import { LogOut } from "lucide-react";
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
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
      {/* SIDEBAR */}
      <aside className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {["overview", "complaints", "chats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === tab
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
            >
              {tab === "overview" && "📊 Overview"}
              {tab === "complaints" && "📋 All Complaints"}
              {tab === "chats" && "💬 Chats"}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Administrator</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">System Access</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <ThemeToggle />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={logout}
              className="flex-1 flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
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
