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
  // Handle text input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle image input (IMPORTANT → name must be imageUrl)
  const handleFile = (e) =>
    setFormData({ ...formData, imageUrl: e.target.files[0] });

  // Fetch GPS
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
      if (val) data.append(key, val);
    });

    try {
      const res = await API.post("/complaint/create-complaint", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Complaint submitted!" });

        setFormData({
          description: "",
          city: "",
          state: "",
          landmark: "",
          latitude: "",
          longitude: "",
          imageUrl: null,
        });

        fetchComplaints();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Submission failed" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl text-slate-900 font-bold mb-6">
        Register New Complaint
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg border ${message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6"
      >
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        <Input
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Nearby landmark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnly label="Latitude" value={formData.latitude} placeholder="Latitude" />
          <ReadOnly label="Longitude" value={formData.longitude} placeholder="Longitude" />
        </div>

        <button
          type="button"
          onClick={getLocation}
          className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium"
        >
          📍 Get Current Location
        </button>

        <div>
          <label className="block mb-2 text-slate-700 font-medium text-sm">Evidence Image</label>
          <input
            type="file"
            onChange={handleFile}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </div>

        <button
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

// Reusable components
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-slate-700 mb-2 block font-medium text-sm">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="text-slate-700 mb-2 block font-medium text-sm">{label}</label>
    <textarea
      {...props}
      rows="4"
      className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
    />
  </div>
);

const ReadOnly = ({ label, value, placeholder }) => (
  <div>
    <label className="text-slate-700 mb-2 block font-medium text-sm">{label}</label>
    <input
      value={value}
      readOnly
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
    />
  </div>
);

export default NewComplaint;
