import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import AdminOverview from "../components/adminDashboard/AdminOverview";
import AllComplaints from "../components/adminDashboard/AllComplaints";

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
      if (res.data.success) setComplaints(res.data.complaints);
    } catch {
      setMessage({ type: "error", text: "Failed to load complaints" });
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // Unified update for status + image upload
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
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl text-white font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {["overview", "complaints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg ${
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
            className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 bg-linear-to-br from-slate-900 to-purple-900/10 overflow-y-auto">
        {/* Toast Message */}
        {message.text && (
          <div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {message.text}
          </div>
        )}

        {/* TABS */}
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

export default AdminDashboard;
