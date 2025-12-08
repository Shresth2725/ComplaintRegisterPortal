const ComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>

            <div className="flex items-center gap-2">
              {complaint.status === "resolved" && complaint.rating > 0 && (
                <span className="text-yellow-500 dark:text-yellow-400 font-bold text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                  ★ {complaint.rating}
                </span>
              )}
              {/* Status Badge */}
              <span
                className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${complaint.status === "resolved"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : complaint.status === "in progress"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }
              `}
              >
                {complaint.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description */}
          <h3 className="text-slate-900 dark:text-white text-lg mt-2 font-semibold line-clamp-2">
            {complaint.description}
          </h3>

          {/* Location */}
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1">
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
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">Before</p>
              <img
                src={complaint.beforeImageUrl}
                alt="Before"
                className="w-36 h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}

          {/* After Image */}
          {complaint.afterImageUrl && (
            <div className="w-36">
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">After</p>
              <img
                src={complaint.afterImageUrl}
                alt="After"
                className="w-36 h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
