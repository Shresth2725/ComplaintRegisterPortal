const ComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>

            {/* Status Badge */}
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${complaint.status === "resolved"
                  ? "bg-green-100 text-green-700"
                  : complaint.status === "in progress"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {complaint.status.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <h3 className="text-slate-900 text-lg mt-2 font-semibold line-clamp-2">
            {complaint.description}
          </h3>

          {/* Location */}
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
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
              <p className="text-slate-500 text-xs mb-1 font-medium">Before</p>
              <img
                src={complaint.beforeImageUrl}
                alt="Before"
                className="w-36 h-32 rounded-lg object-cover border border-slate-200"
              />
            </div>
          )}

          {/* After Image */}
          {complaint.afterImageUrl && (
            <div className="w-36">
              <p className="text-slate-500 text-xs mb-1 font-medium">After</p>
              <img
                src={complaint.afterImageUrl}
                alt="After"
                className="w-36 h-32 rounded-lg object-cover border border-slate-200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
