import { FaCheckCircle, FaTimesCircle, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

function DecisionCard({ result }) {
  if (!result) return null;

  const isInvest = result.decision === "INVEST";

  return (
    <motion.div
      className="glass-card p-6 shadow-lg transition-all duration-350"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          {result.company} Target Analysis
        </h2>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          Model: {result.modelUsed || "gemini-2.5-flash"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Recommendation
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${
              isInvest
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isInvest ? <FaCheckCircle /> : <FaTimesCircle />}
            {result.decision}
          </span>
        </div>

        <div className="text-right">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Confidence
          </h3>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {result.confidence}%
          </h1>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/50">
        <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
          <FaLightbulb className="text-amber-400" />
          AI Investment Thesis Summary
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          {result.reason}
        </p>
      </div>
    </motion.div>
  );
}

export default DecisionCard;