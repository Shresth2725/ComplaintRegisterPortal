const ComplaintCard = ({ complaint }) => {
  return (
    <div
      className="
        bg-linear-to-br from-white/10 to-white/5 
        border border-white/20 
        rounded-xl p-6 shadow-lg backdrop-blur-md
        hover:shadow-xl hover:scale-[1.01] transition-all duration-300
      "
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>

            {/* Status Badge */}
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                  complaint.status === "resolved"
                    ? "bg-green-500/20 text-green-300"
                    : complaint.status === "in progress"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-red-500/20 text-red-300"
                }
              `}
            >
              {complaint.status.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <h3 className="text-white text-lg mt-2 font-semibold">
            {complaint.description}
          </h3>

          {/* Location */}
          <p className="text-gray-400 text-sm mt-1">
            📍 {complaint.landmark}, {complaint.city}
          </p>
        </div>
      </div>

      {/* Images Section */}
      {(complaint.beforeImageUrl || complaint.afterImageUrl) && (
        <div className="flex gap-4 mt-4">
          {/* Before Image */}
          {complaint.beforeImageUrl && (
            <div className="w-36">
              <p className="text-gray-300 text-xs mb-1">Before</p>
              <img
                src={complaint.beforeImageUrl}
                alt="Before"
                className="w-36 h-32 rounded-lg object-cover border border-white/10 shadow"
              />
            </div>
          )}

          {/* After Image */}
          {complaint.afterImageUrl && (
            <div className="w-36">
              <p className="text-gray-300 text-xs mb-1">After</p>
              <img
                src={complaint.afterImageUrl}
                alt="After"
                className="w-36 h-32 rounded-lg object-cover border border-white/10 shadow"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
