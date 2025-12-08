import ThemeToggle from "../ThemeToggle";
import { LogOut } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, user, logout }) => {
  return (
    <aside className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {["overview", "new-complaint", "chats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === tab
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            {tab === "overview" && "📊 Overview"}
            {tab === "new-complaint" && "➕ New Complaint"}
            {tab === "chats" && "💬 Chats"}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all mb-3 group ${activeTab === "profile"
            ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
            : "hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
        >
          <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold border transition-colors ${activeTab === "profile"
            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-800"
            }`}>
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

          <div className="overflow-hidden flex-1">
            <p className={`text-sm font-semibold truncate transition-colors ${activeTab === "profile"
              ? "text-blue-900 dark:text-blue-100"
              : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
              }`}>
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">View Profile</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <ThemeToggle />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button
            onClick={logout}
            className="flex-1 flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
