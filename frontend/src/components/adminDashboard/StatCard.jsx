const StatCard = ({ title, value, color }) => (
  <div className="bg-white/10 p-6 rounded-xl shadow">
    <h3 className={`text-${color}-400 text-sm`}>{title}</h3>
    <p className="text-4xl text-white font-bold">{value}</p>
  </div>
);

export default StatCard;
