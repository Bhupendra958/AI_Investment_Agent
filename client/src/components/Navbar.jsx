function Navbar({ title = "Dashboard" }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="glass-card px-6 py-5 flex justify-between items-center transition-all duration-300 hover:shadow-xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
        <p className="text-slate-300 text-xs mt-0.5">
          Welcome, {user?.name || "Investor"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={user?.picture || "/favicon.svg"}
          alt={user?.name || "User"}
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20 dark:ring-blue-500/40 shadow-sm"
        />
      </div>
    </div>
  );
}

export default Navbar;
