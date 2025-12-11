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

    const [previewImage, setPreviewImage] = useState(null);

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
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-500 dark:text-slate-400">
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans transition-colors">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/admin-dashboard"
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium inline-flex items-center gap-2 mb-6"
                >
                    ← Back to Admin Dashboard
                </Link>

                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Complaint Management</h1>
                        {updating && <span className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">Updating...</span>}
                    </div>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 font-mono select-all">
                        ID: {id}
                    </p>
                </div>

                {/* Toast Message */}
                {message.text && (
                    <div
                        className={`mb-6 px-6 py-3 rounded-lg shadow-sm border ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300"
                            } font-medium`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-8 space-y-8 transition-colors">
                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Description</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{complaint.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location Info */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Location Details</h3>
                            <div className="space-y-3">
                                <p className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <span className="text-xl">📍</span>
                                    <span className="font-medium">{complaint.landmark}</span>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 pl-7">
                                    {complaint.city}, {complaint.state}
                                </p>
                                <div className="pt-2 pl-7 text-sm text-slate-500 dark:text-slate-500 space-y-1 font-mono">
                                    <p>Lat: {complaint.latitude}</p>
                                    <p>Lng: {complaint.longitude}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 transition-colors">
                            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-4">Admin Actions</h3>

                            <div className="space-y-6">
                                {complaint.rating > 0 && (
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-600">
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">User Rating</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400 text-xl">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < complaint.rating ? "★" : "☆"}</span>
                                                ))}
                                            </div>
                                            <span className="text-blue-900 dark:text-white font-bold">{complaint.rating}/5</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Update Status</label>
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
                                        className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        disabled={updating}
                                    >
                                        <option value="new">New</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>

                                {complaint.status !== "resolved" && (
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Upload Resolution Image</label>
                                        <label className="flex items-center justify-center w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">Choose Image...</span>
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
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Location on Map</h2>
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                            <MapLeaflet lat={complaint.latitude} lng={complaint.longitude} />
                        </div>
                        <div className="mt-4">
                            <a
                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <span>🗺️</span> Open in Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Evidence & Resolution</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Before Image */}
                            {complaint.beforeImageUrl && (
                                <div className="space-y-2">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">Before</p>
                                    <div
                                        className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors"
                                        onClick={() => setPreviewImage(complaint.beforeImageUrl)}
                                    >
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
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">After</p>
                                {complaint.afterImageUrl ? (
                                    <div
                                        className="rounded-xl overflow-hidden border-2 border-green-100 shadow-sm bg-green-50/30 cursor-pointer"
                                        onClick={() => setPreviewImage(complaint.afterImageUrl)}
                                    >
                                        <img
                                            src={complaint.afterImageUrl}
                                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                            alt="After"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                                        <span className="text-4xl mb-2">📷</span>
                                        <p>No resolution image uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    {complaint.user && (
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Submitted By</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/30">
                                    {complaint.user.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium">{complaint.user.fullName}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{complaint.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHAT BUTTON */}
                    <div className="pt-6 text-center">
                        <Link
                            to={`/complaint/${id}/chat`}
                            className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
                        >
                            <span>💬</span>
                            Chat with User
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 focus:outline-none"
                        onClick={() => setPreviewImage(null)}
                    >
                        &times;
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminComplaintOverviewPage;
