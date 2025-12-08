import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MapLeaflet from "../components/dashboard/MapLeaflet";

const ComplaintOverviewPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState();

  const [previewImage, setPreviewImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = async (value) => {
    try {
      const res = await API.post(`/complaint/rate/${id}`, { rating: value });
      if (res.data.success) {
        setComplaint({ ...complaint, rating: value });
        setRating(value);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/complaint/get-complaint-data/${id}`);
      setComplaint(res.data.complaint);
      setIsAdmin(res.data.isAdmin);
    } catch (error) {
      console.error("Error fetching complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, []);

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
          to={isAdmin ? "/admin-dashboard" : "/dashboard"}
          className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium inline-flex items-center gap-2 mb-6 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Complaint Overview</h1>

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

            {/* Status */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Status & Category</h3>

              <div className="mb-4">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider block mb-2">Current Status</span>
                <span
                  className={`capitalize px-4 py-2 rounded-lg font-bold inline-block ${complaint.status === "resolved"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : complaint.status === "in progress"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                >
                  {complaint.status}
                </span>
              </div>



              {complaint.category && (
                <div className="mb-4">
                  <span className="text-slate-500 text-sm font-medium uppercase tracking-wider block mb-2">Category</span>
                  <p className="text-slate-900 font-medium">
                    {complaint.category.replace(/_/g, " ")}
                  </p>
                </div>
              )}

              {/* Rating Section */}
              {complaint.status === "resolved" && !isAdmin && (
                <div>
                  <span className="text-slate-500 text-sm font-medium uppercase tracking-wider block mb-2">
                    {complaint.rating ? "Your Rating" : "Rate Resolution"}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`text-2xl transition-colors ${star <= (hoverRating || complaint.rating || rating)
                          ? "text-yellow-400"
                          : "text-slate-300 dark:text-slate-600"
                          } cursor-pointer hover:scale-110`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {complaint.rating > 0 && (
                    <p className="text-xs text-slate-500 mt-1">Thank you for your feedback!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Location on Map</h2>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
              <MapLeaflet lat={complaint.latitude} lng={complaint.longitude} />
            </div>

            {/* Google Maps Redirect */}
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
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">After</p>
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
          {!isAdmin && complaint.user && (
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

          {/* CHAT BUTTON AT THE BOTTOM */}
          <div className="pt-6 text-center">
            <Link
              to={`/complaint/${id}/chat`}
              className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <span>💬</span>
              {isAdmin ? "Chat with User" : "Chat with Admin"}
            </Link>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {
        previewImage && (
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
        )
      }
    </div >
  );
};

export default ComplaintOverviewPage;
