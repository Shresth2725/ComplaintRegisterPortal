import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import MapLeaflet from "../components/dashboard/MapLeaflet";

const AdminComplaintOverviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchComplaint = async () => {
        try {
            const res = await API.get(`/complaint/get-complaint-data/${id}`);
            setComplaint(res.data.complaint);
            // Verify admin status if needed, though ProtectedRoute should handle basic auth
            if (!res.data.isAdmin) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching complaint:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const updateComplaint = async (status, file) => {
        const formData = new FormData();
        if (status) formData.append("status", status);
        if (file) formData.append("imageUrl", file);

        setUpdating(true);

        try {
            const res = await API.post(
                `/complaint/update-complaint-status-upload-image/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                setMessage({ type: "success", text: "Complaint updated successfully!" });
                fetchComplaint(); // Refresh data
            }
        } catch (error) {
            setMessage({ type: "error", text: "Update failed. Please try again." });
        } finally {
            setUpdating(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
                Loading complaint details...
            </div>
        );

    if (!complaint)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
                Complaint not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/admin-dashboard"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium inline-flex items-center gap-2 mb-6"
                >
                    ← Back to Admin Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Complaint Management</h1>
                    {updating && <span className="text-blue-600 font-medium animate-pulse">Updating...</span>}
                </div>

                {/* Toast Message */}
                {message.text && (
                    <div
                        className={`mb-6 px-6 py-3 rounded-lg shadow-sm border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                            } font-medium`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-8">
                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Description</h2>
                        <p className="text-slate-700 leading-relaxed text-lg">{complaint.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location Info */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Location Details</h3>
                            <div className="space-y-3">
                                <p className="text-slate-700 flex items-start gap-2">
                                    <span className="text-xl">📍</span>
                                    <span className="font-medium">{complaint.landmark}</span>
                                </p>
                                <p className="text-slate-600 pl-7">
                                    {complaint.city}, {complaint.state}
                                </p>
                                <div className="pt-2 pl-7 text-sm text-slate-500 space-y-1 font-mono">
                                    <p>Lat: {complaint.latitude}</p>
                                    <p>Lng: {complaint.longitude}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-blue-900 mb-4">Admin Actions</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-blue-800 mb-2">Update Status</label>
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            if (newStatus === "resolved" && !complaint.afterImageUrl) {
                                                alert("Please upload an AFTER image before marking as resolved.");
                                                return;
                                            }
                                            updateComplaint(newStatus, null);
                                        }}
                                        className="w-full bg-white border border-blue-200 text-slate-700 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={updating}
                                    >
                                        <option value="new">New</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>

                                {complaint.status !== "resolved" && (
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">Upload Resolution Image</label>
                                        <label className="flex items-center justify-center w-full px-4 py-2.5 bg-white border border-blue-200 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                                            <span className="text-blue-600 font-medium">Choose Image...</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => updateComplaint(null, e.target.files[0])}
                                                className="hidden"
                                                disabled={updating}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Location on Map</h2>
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <MapLeaflet lat={complaint.latitude} lng={complaint.longitude} />
                        </div>
                        <div className="mt-4">
                            <a
                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <span>🗺️</span> Open in Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Evidence & Resolution</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Before Image */}
                            {complaint.beforeImageUrl && (
                                <div className="space-y-2">
                                    <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">Before</p>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                                        <img
                                            src={complaint.beforeImageUrl}
                                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                            alt="Before"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* After Image */}
                            <div className="space-y-2">
                                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">After</p>
                                {complaint.afterImageUrl ? (
                                    <div className="rounded-xl overflow-hidden border-2 border-green-100 shadow-sm bg-green-50/30">
                                        <img
                                            src={complaint.afterImageUrl}
                                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                            alt="After"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                        <span className="text-4xl mb-2">📷</span>
                                        <p>No resolution image uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    {complaint.user && (
                        <div className="pt-8 border-t border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-2">Submitted By</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                    {complaint.user.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-slate-900 font-medium">{complaint.user.fullName}</p>
                                    <p className="text-slate-500 text-sm">{complaint.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHAT BUTTON */}
                    <div className="pt-6 text-center">
                        <button className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 mx-auto">
                            <span>💬</span>
                            Chat with User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminComplaintOverviewPage;
