import API from "../../api/axios";

const Profile = ({
  profileData,
  setProfileData,
  message,
  setMessage,
  submitLoading,
  setSubmitLoading,
  user,
  setUser,
}) => {
  const handleChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profilePic: file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const data = new FormData();
    data.append("fullName", profileData.fullName);
    data.append("address", profileData.address);
    if (profileData.profilePic)
      data.append("profilePic", profileData.profilePic);

    try {
      const res = await API.post("/auth/update", data);
      if (res.data.success) {
        setMessage({ type: "success", text: "Profile Updated!" });
        setUser(res.data.user);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
    } catch {
      setMessage({ type: "error", text: "Update failed" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Edit Profile</h1>

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
        onSubmit={updateProfile}
        className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center text-purple-300 text-3xl">
            {profileData.previewUrl ? (
              <img
                src={profileData.previewUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.fullName?.charAt(0)
            )}
          </div>

          <label className="cursor-pointer mt-3 bg-white/10 px-4 py-2 text-white rounded-lg hover:bg-white/20">
            Change Photo
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        </div>

        <Input
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
        />

        <TextArea
          label="Address"
          name="address"
          value={profileData.address}
          onChange={handleChange}
        />

        <button
          disabled={submitLoading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg"
        >
          {submitLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
    />
  </div>
);

export default Profile;
