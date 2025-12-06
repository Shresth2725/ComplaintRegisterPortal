import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MapLeaflet from "../components/dashboard/MapLeaflet";

const ComplaintOverviewPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/complaint/get-complaint-data/${id}`);
      setComplaint(res.data.complaint);
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
      <div className="p-6 text-gray-400 text-center">
        Loading complaint details...
      </div>
    );

  if (!complaint)
    return (
      <div className="p-6 text-gray-400 text-center">Complaint not found.</div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Back Button */}
      <Link to="/dashboard" className="text-purple-400 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl mt-4 mb-6 font-semibold">Complaint Overview</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300">{complaint.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Info */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold mb-1">Location</h3>
            <p className="text-gray-300">📍 {complaint.landmark}</p>
            <p className="text-gray-400 text-sm">
              {complaint.city}, {complaint.state}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Latitude: {complaint.latitude}
            </p>
            <p className="text-gray-400 text-sm">
              Longitude: {complaint.longitude}
            </p>
          </div>

          {/* Status */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold mb-1">Status</h3>
            <p
              className={`capitalize text-sm px-3 py-1 inline-block rounded-lg ${
                complaint.status === "resolved"
                  ? "bg-green-600"
                  : complaint.status === "in progress"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {complaint.status}
            </p>

            {complaint.category && (
              <p className="mt-2 text-gray-400 text-sm">
                Category: {complaint.category}
              </p>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Location on Map</h2>

          <MapLeaflet lat={complaint.latitude} lng={complaint.longitude} />

          {/* Google Maps Redirect */}
          <div className="mt-4">
            <a
              href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Images Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Image */}
            {complaint.beforeImageUrl && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-400 mb-2">Before</p>
                <img
                  src={complaint.beforeImageUrl}
                  className="rounded-xl border border-white/10 w-full h-64 object-cover"
                  alt="Before"
                />
              </div>
            )}

            {/* After Image */}
            {complaint.afterImageUrl ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-400 mb-2">After</p>
                <img
                  src={complaint.afterImageUrl}
                  className="rounded-xl border border-white/10 w-full h-64 object-cover"
                  alt="After"
                />
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center h-64">
                <p className="text-gray-500">No after-image uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {complaint.user && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Submitted By</h2>
            <p className="text-gray-300">{complaint.user.fullName}</p>
            <p className="text-gray-400 text-sm">{complaint.user.email}</p>
          </div>
        )}

        {/* CHAT BUTTON AT THE BOTTOM */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg">
            Chat with Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintOverviewPage;
