import { FaCheckCircle, FaTimesCircle, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

function DecisionCard({ result }) {
  if (!result) return null;

  const isInvest = result.decision === "INVEST";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
        <h2 className="text-xl font-black text-white tracking-tight">
          {result.company} Target Analysis
        </h2>
        <span className="text-[9px] text-slate-500 font-mono bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
          Model: {result.modelUsed || "gemini-3.1-flash-lite"}
        </span>
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            Recommendation Verdict
          </h3>
          <motion.span
            whileHover={{ scale: 1.03 }}
            className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-black relative overflow-hidden ${
              isInvest
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5"
            }`}
          >
            {isInvest ? <FaCheckCircle /> : <FaTimesCircle />}
            {result.decision}
          </motion.span>
        </div>

        <div className="text-right">
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            Confidence Rating
          </h3>
          <h1 className="text-3.5xl font-black text-white tracking-tight">
            {result.confidence}%
          </h1>
        </div>
      </div>

      <div className="mt-6 p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 relative z-10">
        <h3 className="font-extrabold text-xs text-slate-200 flex items-center gap-2 mb-2">
          <FaLightbulb className="text-amber-400" />
          AI Investment Thesis Summary
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed font-medium">
          {result.reason}
        </p>
      </div>
    </motion.div>
  );
}

export default DecisionCard;