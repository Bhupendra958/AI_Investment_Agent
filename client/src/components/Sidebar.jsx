import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/80 text-white shadow-[8px_0_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl border-r border-white/5 flex flex-col z-40">
      {/* Top highlight glow */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-blue-500/10 via-emerald-500/5 to-transparent" />

      {/* Logo */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-blue-600/10 to-emerald-500/5 flex-shrink-0 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-blue-500/10 blur-xl" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 blur-xs opacity-50" />
            <FaChartLine className="text-sm relative z-10" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              AI Investment
            </h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
              Research Hub
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user?.name && (
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-3.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-lg shadow-blue-500/10 relative">
            <span className="relative z-10">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-bold truncate tracking-tight">{user.name}</p>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isAdmin ? "text-amber-400" : "text-slate-400"}`}>
              {isAdmin ? "⚡ Administrator" : "User Account"}
            </p>
          </div>
        </div>
      )}

      {/* Scrollable Menu */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar scrollbar-thin">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm group"
            >
              {/* Highlight background pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveLink"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                    link.admin
                      ? "from-amber-600 to-orange-500 shadow-md shadow-amber-500/10"
                      : "from-blue-600 to-cyan-500 shadow-md shadow-blue-500/15"
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover effect highlight */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-white/[0.02] border border-white/0 group-hover:border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
              )}

              {/* Left active line glow indicator */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-white" />
              )}

              <span className={`text-sm relative z-10 transition-colors duration-200 ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              }`}>
                {link.icon}
              </span>
              <span className={`relative z-10 transition-colors duration-200 font-semibold ${
                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5 flex-shrink-0 bg-slate-950/40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2.5 bg-rose-600/10 border border-rose-500/20 text-rose-300 hover:text-white hover:bg-rose-600 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-rose-600/20"
        >
          <FaSignOutAlt className="text-xs" />
          Logout Profile
        </motion.button>
      </div>
    </aside>
  );
}

export default Sidebar;