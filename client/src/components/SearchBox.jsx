import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

function SearchBox({ handleResearch, loading }) {
  const [company, setCompany] = useState("");

  const submit = () => {
    if (loading || !company.trim()) return;
    handleResearch(company);
    setCompany("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}
      className="rounded-3xl border border-white/5 bg-slate-950/30 p-6 backdrop-blur-md shadow-xl transition-colors relative overflow-hidden"
    >
      {/* Top highlight glow */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <h2 className="text-lg font-black text-white tracking-tight">Research Target Company</h2>
      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
        Enter a company name to execute the LangGraph AI-powered invest or pass recommendation pipeline.
      </p>

      <div className="flex flex-col sm:flex-row gap-3.5 mt-5">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-blue-400 transition-colors" />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Apple, Tesla, Microsoft, NVIDIA..."
            disabled={loading}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.01] focus:ring-4 focus:ring-blue-500/5 transition-all disabled:opacity-50 font-medium"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={submit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-75 disabled:hover:scale-100 flex items-center justify-center min-w-[140px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/20 border-t-white"></span>
              Researching...
            </span>
          ) : (
            "Analyze Company"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default SearchBox;
