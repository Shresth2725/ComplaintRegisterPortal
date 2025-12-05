import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import Sidebar from "../components/dashboard/Sidebar";
import Overview from "../components/dashboard/Overview";
import MyComplaints from "../components/dashboard/MyComplaints";
import NewComplaint from "../components/dashboard/NewComplaint";
import Profile from "../components/dashboard/Profile";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
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
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaint/get-complaints");
      if (res.data.success) setComplaints(res.data.complaints);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10 bg-gradient-to-br from-slate-900 to-purple-900/10">
        {activeTab === "overview" && (
          <Overview
            complaints={complaints}
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
            fetchComplaints={fetchComplaints}
          />
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
