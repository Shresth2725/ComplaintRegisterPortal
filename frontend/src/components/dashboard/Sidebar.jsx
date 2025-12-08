const Sidebar = ({ activeTab, setActiveTab, user, logout }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {["overview", "new-complaint", "chats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === tab
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            {tab === "overview" && "📊 Overview"}
            {tab === "new-complaint" && "➕ New Complaint"}
            {tab === "chats" && "💬 Chats"}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={logout}
          className="w-full mb-4 px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-sm font-medium shadow-sm"
        >
          🚪 Logout
        </button>

        <div
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === "profile" ? "bg-blue-50" : "hover:bg-white"
            }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              user?.fullName?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
