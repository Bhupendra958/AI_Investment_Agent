import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaChartLine,
  FaUserCircle,
  FaHistory,
  FaSignOutAlt,
  FaShieldAlt,
  FaExchangeAlt,
  FaComments,
  FaRegStar,
  FaBriefcase,
  FaNewspaper,
  FaNetworkWired,
  FaChartBar,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const navLinks = [
    { to: "/dashboard", icon: <FaChartLine />, label: "Dashboard" },
    { to: "/charts", icon: <FaChartBar />, label: "Stock Charts" },
    { to: "/watchlist", icon: <FaRegStar />, label: "Watchlist" },
    { to: "/portfolio", icon: <FaBriefcase />, label: "Portfolio Sim" },
    { to: "/compare", icon: <FaExchangeAlt />, label: "Comparison" },
    { to: "/chat", icon: <FaComments />, label: "AI Stock Chat" },
    { to: "/news", icon: <FaNewspaper />, label: "Market News" },
    { to: "/langgraph", icon: <FaNetworkWired />, label: "LangGraph Flow" },
    { to: "/history", icon: <FaHistory />, label: "History" },
    { to: "/profile", icon: <FaUserCircle />, label: "Profile" },
  ];

  if (isAdmin) {
    navLinks.splice(1, 0, {
      to: "/admin",
      icon: <FaShieldAlt />,
      label: "Admin Panel",
      admin: true,
    });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl border-r border-white/10 flex flex-col z-40">

      {/* Logo */}
      <div className="p-5 border-b border-white/10 bg-gradient-to-br from-blue-600/20 to-emerald-500/10 flex-shrink-0">
        <h1 className="text-xl font-bold text-white tracking-tight">
          AI Investment
        </h1>
        <p className="text-slate-300 text-xs mt-0.5">
          Research Platform
        </p>
      </div>

      {/* User Info */}
      {user?.name && (
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className={`text-[9px] font-semibold uppercase tracking-wider ${isAdmin ? "text-amber-400" : "text-slate-400"}`}>
              {isAdmin ? "⚡ Administrator" : "User"}
            </p>
          </div>
        </div>
      )}

      {/* Scrollable Menu */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm ${
              location.pathname === link.to
                ? link.admin
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg font-medium"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg font-medium"
                : link.admin
                  ? "text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-sm">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-rose-600/90 hover:bg-rose-600 text-white py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <FaSignOutAlt className="text-xs" />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;