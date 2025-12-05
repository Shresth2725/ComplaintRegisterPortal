const Sidebar = ({ activeTab, setActiveTab, user, logout }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {["overview", "my-complaints", "new-complaint"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab === "overview" && "📊 Overview"}
            {tab === "my-complaints" && "📝 My Complaints"}
            {tab === "new-complaint" && "➕ New Complaint"}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full mb-4 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20"
        >
          🚪 Logout
        </button>

        <div
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.fullName?.charAt(0)
            )}
          </div>

          <div>
            <p className="text-sm text-white">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
