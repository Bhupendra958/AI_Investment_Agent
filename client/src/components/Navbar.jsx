import { motion } from "framer-motion";

function Navbar({ title = "Dashboard" }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card px-6 py-5 flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/[0.02]"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
        <p className="text-slate-400 text-xs mt-0.5 font-medium">
          Welcome, {user?.name || "Investor"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 blur-sm opacity-25 group-hover:opacity-75 transition-opacity" />
          <img
            src={user?.picture || "/favicon.svg"}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 relative z-10 shadow-sm"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Navbar;
