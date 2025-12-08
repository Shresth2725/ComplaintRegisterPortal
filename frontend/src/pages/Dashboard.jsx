import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import Sidebar from "../components/dashboard/Sidebar";
import Overview from "../components/dashboard/Overview";
import MyComplaints from "../components/dashboard/MyComplaints";
import NewComplaint from "../components/dashboard/NewComplaint";
import Profile from "../components/dashboard/Profile";
import UserChats from "../components/dashboard/UserChats";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("dashboardActiveTab") || "overview"
  );

  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);
  const [stats, setStats] = useState({
    total: 0,
    newComplaint: 0,
    inProgressComplaint: 0,
    resolvedComplaint: 0,
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    city: "",
    state: "",
    landmark: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    profilePic: null,
    previewUrl: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsed = JSON.parse(data);
      setUser(parsed);
      setProfileData({
        fullName: parsed.fullName,
        address: parsed.address,
        previewUrl: parsed.profilePic || null,
      });
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/my-stats");
      if (res.data.success) setStats(res.data.stats);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10">
        {activeTab === "overview" && (
          <Overview
            stats={stats}
            loading={loading}
            setActiveTab={setActiveTab}
          />
        )}
        {/* {activeTab === "my-complaints" && (
          <MyComplaints
            complaints={complaints}
            loading={loading}
            setActiveTab={setActiveTab}
          />
        )} */}
        {activeTab === "new-complaint" && (
          <NewComplaint
            formData={formData}
            setFormData={setFormData}
            submitLoading={submitLoading}
            setSubmitLoading={setSubmitLoading}
            message={message}
            setMessage={setMessage}
            fetchComplaints={fetchStats}
          />
        )}
        {activeTab === "chats" && (
          <UserChats setActiveTab={setActiveTab} />
        )}
        {activeTab === "profile" && (
          <Profile
            profileData={profileData}
            setProfileData={setProfileData}
            message={message}
            setMessage={setMessage}
            submitLoading={submitLoading}
            setSubmitLoading={setSubmitLoading}
            user={user}
            setUser={setUser}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
