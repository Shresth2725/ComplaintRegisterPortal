const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color] || colorClasses.slate} shadow-sm`}>
      <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
