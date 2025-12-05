import API from "../../api/axios";

const NewComplaint = ({
  formData,
  setFormData,
  submitLoading,
  setSubmitLoading,
  message,
  setMessage,
  fetchComplaints,
}) => {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setFormData({ ...formData, image: e.target.files[0] });

  const getLocation = () => {
    if (!navigator.geolocation)
      return setMessage({ type: "error", text: "Geolocation not supported" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        });
        setMessage({ type: "success", text: "Location fetched!" });
      },
      () => setMessage({ type: "error", text: "Unable to fetch location" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key === "image" ? "imageUrl" : key, val);
    });

    try {
      const res = await API.post("/complaint/create-complaint", data);
      if (res.data.success) {
        setMessage({ type: "success", text: "Complaint submitted!" });
        setFormData({
          description: "",
          city: "",
          state: "",
          landmark: "",
          latitude: "",
          longitude: "",
          image: null,
        });
        fetchComplaints();
      }
    } catch {
      setMessage({ type: "error", text: "Submission failed" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl text-white font-bold mb-6">
        Register New Complaint
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6"
      >
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnly label="Latitude" value={formData.latitude} />
          <ReadOnly label="Longitude" value={formData.longitude} />
        </div>

        <button
          type="button"
          onClick={getLocation}
          className="w-full py-2 bg-blue-500/20 text-blue-300 rounded-lg"
        >
          📍 Get Location
        </button>

        <div>
          <label className="block mb-2 text-gray-300">Evidence Image</label>
          <input type="file" onChange={handleFile} className="text-gray-400" />
        </div>

        <button
          className="w-full py-3 bg-purple-600 text-white rounded-lg"
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-gray-300 mb-2 block">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-lg"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="text-gray-300 mb-2 block">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-lg"
    />
  </div>
);

const ReadOnly = ({ label, value }) => (
  <div>
    <label className="text-gray-300 mb-2 block">{label}</label>
    <input
      value={value}
      readOnly
      className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-lg opacity-70"
    />
  </div>
);

export default NewComplaint;
