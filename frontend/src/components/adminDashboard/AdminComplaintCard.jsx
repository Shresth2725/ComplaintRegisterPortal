const AdminComplaintCard = ({ complaint }) => {
  const c = complaint;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">

      <div className="flex flex-col md:flex-row gap-6">
        {/* IMAGES */}
        <div className="md:w-1/4 space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-medium">Before Image:</p>
            <img
              src={c.beforeImageUrl}
              className="w-full h-48 object-cover rounded-lg border border-slate-200"
              alt="Before"
            />
          </div>

          {c.afterImageUrl && (
            <div>
              <p className="text-xs text-green-600 mb-1 font-medium">After Image:</p>
              <img
                src={c.afterImageUrl}
                className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                alt="After"
              />
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl text-slate-900 font-bold">
              {c.category?.replace("_", " ").toUpperCase()}
            </h3>
            <span className="text-sm text-slate-500">
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-slate-700 mt-3 leading-relaxed">{c.description}</p>

          <div className="flex flex-wrap gap-4 my-4 text-slate-500 text-sm">
            <p className="flex items-center gap-1">
              📍 {c.city}, {c.state}
            </p>
            <p className="flex items-center gap-1">🏢 {c.landmark}</p>
          </div>

          {/* STATUS */}
          <div className="mt-6 flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${c.status === "resolved"
                ? "bg-green-100 text-green-700"
                : c.status === "in progress"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {c.status}
            </span>

            {c.status === "resolved" && c.rating > 0 && (
              <span className="text-yellow-600 font-bold text-xs flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                ★ {c.rating}/5
              </span>
            )}

            <span className="text-sm text-slate-500 ml-auto">
              Click to manage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintCard;
