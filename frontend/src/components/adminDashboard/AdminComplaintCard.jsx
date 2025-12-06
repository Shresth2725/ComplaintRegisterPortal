const AdminComplaintCard = ({ complaint, updatingId, updateComplaint }) => {
  const c = complaint;

  return (
    <div className="bg-white/5 p-6 rounded-xl relative">
      {updatingId === c._id && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
          Updating...
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* IMAGES */}
        <div className="md:w-1/4 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Before Image:</p>
            <img
              src={c.beforeImageUrl}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {c.afterImageUrl && (
            <div>
              <p className="text-xs text-green-400 mb-1">After Image:</p>
              <img
                src={c.afterImageUrl}
                className="w-full h-48 object-cover rounded-lg border-2 border-green-500/40"
              />
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <h3 className="text-xl text-white font-semibold">
            {c.category?.replace("_", " ").toUpperCase()}
          </h3>

          <p className="text-gray-400 mt-1">
            {new Date(c.createdAt).toLocaleDateString()}
          </p>

          <p className="text-gray-300 mt-3">{c.description}</p>

          <div className="flex gap-4 my-3 text-gray-400">
            <p>
              📍 {c.city}, {c.state}
            </p>
            <p>🏢 {c.landmark}</p>
          </div>

          {/* STATUS + UPLOAD */}
          <div className="mt-4 flex items-center gap-4">
            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                c.status === "resolved"
                  ? "bg-green-500/20 text-green-400"
                  : c.status === "in progress"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {c.status.toUpperCase()}
            </span>

            {/* STATUS SELECT */}
            <select
              value={c.status}
              onChange={(e) => {
                const newStatus = e.target.value;

                if (newStatus === "resolved" && !c.afterImageUrl) {
                  alert("Upload AFTER image before resolving!");
                  return;
                }

                updateComplaint(c._id, newStatus, null);
              }}
              className="bg-slate-800 text-white px-3 py-2 rounded"
            >
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* UPLOAD AFTER IMAGE */}
            {c.status !== "resolved" && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateComplaint(c._id, null, e.target.files[0])
                }
                className="text-gray-300"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintCard;
