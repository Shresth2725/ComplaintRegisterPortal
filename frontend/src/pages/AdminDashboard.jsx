import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [complaints, setComplaints] = useState({
        newComplaint: [],
        inProgressComplaint: [],
        resolvedComplaint: [],
    });
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Robustness states
    const [updatingId, setUpdatingId] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem("userData");
        if (data) {
            const parsed = JSON.parse(data);
            setUser(parsed);
            if (!parsed.isAdmin) {
                // navigate("/dashboard"); 
            }
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get("/complaint/get-all-complaints");
            if (res.data.success) {
                setComplaints(res.data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch complaints", error);
            setMessage({ type: "error", text: "Failed to load complaints." });
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("userData");
        navigate("/login");
    };

    const handleStatusChange = async (id, newStatus) => {
        if (newStatus === "resolved") {
            const complaint = complaints.newComplaint.find(c => c._id === id) ||
                complaints.inProgressComplaint.find(c => c._id === id) ||
                complaints.resolvedComplaint.find(c => c._id === id);

            if (complaint && !complaint.afterImageUrl) {
                setMessage({ type: "error", text: "Please upload a resolution image first." });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
                return;
            }
        }

        setUpdatingId(id);
        setMessage({ type: "", text: "" });
        try {
            const res = await API.post(`/complaint/update-complaint-status/${id}`, {
                status: newStatus,
            });
            if (res.data.success) {
                setMessage({ type: "success", text: "Status updated successfully!" });
                await fetchComplaints();
            }
        } catch (error) {
            console.error("Failed to update status", error);
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to update status." });
        } finally {
            setUpdatingId(null);
            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleImageUpload = async (id, file) => {
        if (!file) return;
        setUploadingId(id);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("imageUrl", file);

        try {
            const res = await API.post(`/complaint/upload-after-image/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                setMessage({ type: "success", text: "Resolution image uploaded!" });
                await fetchComplaints();
            }
        } catch (error) {
            console.error("Failed to upload image", error);
            setMessage({ type: "error", text: "Failed to upload image." });
        } finally {
            setUploadingId(null);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Admin Panel
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {["overview", "complaints"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab
                                ? "bg-purple-600 text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {tab === "overview" && "📊 Overview"}
                            {tab === "complaints" && "📋 All Complaints"}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full mb-4 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20"
                    >
                        🚪 Logout
                    </button>
                    <div className="px-4 py-3">
                        <p className="text-sm text-white">{user?.fullName} (Admin)</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10 bg-gradient-to-br from-slate-900 to-purple-900/10">
                {/* Global Message Toast */}
                {message.text && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
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
                        uploadingId={uploadingId}
                        onStatusChange={handleStatusChange}
                        onImageUpload={handleImageUpload}
                    />
                )}
            </main>
        </div>
    );
};



const AdminOverview = ({ complaints, loading }) => {
    const total =
        complaints.newComplaint.length +
        complaints.inProgressComplaint.length +
        complaints.resolvedComplaint.length;

    const data = [
        { name: 'New', value: complaints.newComplaint.length, color: '#EF4444' }, // Red-500
        { name: 'In Progress', value: complaints.inProgressComplaint.length, color: '#EAB308' }, // Yellow-500
        { name: 'Resolved', value: complaints.resolvedComplaint.length, color: '#22C55E' }, // Green-500
    ];

    return (
        <>
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-md mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                    Admin Dashboard
                </h1>
                <p className="text-gray-300 text-sm mt-1">
                    Manage all reported complaints.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total" value={total} color="gray" />
                <StatCard title="New" value={complaints.newComplaint.length} color="red" />
                <StatCard title="In Progress" value={complaints.inProgressComplaint.length} color="yellow" />
                <StatCard title="Resolved" value={complaints.resolvedComplaint.length} color="green" />
            </div>

            {/* Pie Chart Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-md mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Complaints Distribution</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Bar Chart Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-md mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Complaints by Category</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                ...complaints.newComplaint,
                                ...complaints.inProgressComplaint,
                                ...complaints.resolvedComplaint
                            ].reduce((acc, curr) => {
                                const category = curr.category || "other";
                                const existing = acc.find(item => item.name === category);
                                if (existing) {
                                    existing.value += 1;
                                } else {
                                    acc.push({ name: category, value: 1 });
                                }
                                return acc;
                            }, []).map(item => ({
                                ...item,
                                displayName: item.name.replace(/_/g, ' ').toUpperCase()
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="displayName" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="value" name="Complaints" radius={[4, 4, 0, 0]}>
                                {[
                                    ...complaints.newComplaint,
                                    ...complaints.inProgressComplaint,
                                    ...complaints.resolvedComplaint
                                ].reduce((acc, curr) => {
                                    const category = curr.category || "other";
                                    if (!acc.find(item => item.name === category)) {
                                        acc.push({ name: category });
                                    }
                                    return acc;
                                }, []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1', '#EF4444', '#14B8A6'][index % 8]} />
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
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-md">
        <h3 className={`text-${color}-300 text-sm font-semibold tracking-wide`}>{title}</h3>
        <p className="text-4xl font-extrabold text-white mt-3">{value}</p>
    </div>
);

const AllComplaints = ({ complaints, loading, updatingId, uploadingId, onStatusChange, onImageUpload }) => {
    const [filter, setFilter] = useState("all");

    const getFilteredComplaints = () => {
        switch (filter) {
            case "new":
                return complaints.newComplaint;
            case "in progress":
                return complaints.inProgressComplaint;
            case "resolved":
                return complaints.resolvedComplaint;
            default:
                return [
                    ...complaints.newComplaint,
                    ...complaints.inProgressComplaint,
                    ...complaints.resolvedComplaint
                ];
        }
    };

    const displayedComplaints = getFilteredComplaints();

    if (loading) return <div className="text-white text-center mt-10">Loading complaints...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">All Complaints</h2>
                <div className="flex items-center gap-2">
                    <label className="text-gray-400 text-sm">Filter by Status:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-800 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All</option>
                        <option value="new">New</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {displayedComplaints.length === 0 && <p className="text-gray-400">No complaints found for this filter.</p>}

            {displayedComplaints.map((complaint) => (
                <div key={complaint._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors relative">
                    {/* Loading Overlay for this specific card */}
                    {(updatingId === complaint._id || uploadingId === complaint._id) && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                            <div className="text-white font-semibold animate-pulse">
                                {updatingId === complaint._id ? "Updating Status..." : "Uploading Image..."}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4 space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Before Image:</p>
                                <img
                                    src={complaint.beforeImageUrl || "https://via.placeholder.com/150"}
                                    alt="Complaint"
                                    className="w-full h-48 object-cover rounded-lg border border-white/10"
                                />
                            </div>
                            {complaint.afterImageUrl && (
                                <div>
                                    <p className="text-xs text-green-400 mb-1">Resolved Image:</p>
                                    <img
                                        src={complaint.afterImageUrl}
                                        alt="Resolved"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-green-500/50"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{complaint.category.replace('_', ' ').toUpperCase()}</h3>
                                    <p className="text-gray-400 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                    complaint.status === 'in progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {complaint.status.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-gray-300">{complaint.description}</p>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <p>📍 {complaint.city}, {complaint.state}</p>
                                <p>🏢 {complaint.landmark}</p>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-400">Status:</label>
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => onStatusChange(complaint._id, e.target.value)}
                                        disabled={updatingId === complaint._id || uploadingId === complaint._id}
                                        className="bg-slate-800 text-white border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                    >
                                        <option value="new">New</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>

                                {complaint.status !== 'resolved' && (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-400">Upload Resolution:</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onImageUpload(complaint._id, e.target.files[0])}
                                            disabled={updatingId === complaint._id || uploadingId === complaint._id}
                                            className="text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 disabled:opacity-50"
                                        />
                                    </div>
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
