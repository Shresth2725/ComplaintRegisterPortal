const ComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between">
        <div>
          <span className="text-gray-400 text-sm">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>

          <h3 className="text-white text-lg mt-1">{complaint.description}</h3>

          <p className="text-gray-400 text-sm">
            📍 {complaint.landmark}, {complaint.city}, {complaint.state}
          </p>
        </div>

        {complaint.imageUrl && (
          <img
            src={complaint.imageUrl}
            alt="Complaint"
            className="w-32 h-32 rounded-lg object-cover border border-white/10"
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
