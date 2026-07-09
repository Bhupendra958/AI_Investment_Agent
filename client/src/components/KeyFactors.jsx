import { FaCheckCircle } from "react-icons/fa";

function KeyFactors({ result }) {
  if (!result || !result.factors) return null;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 transition-all duration-350 hover:-translate-y-0.5 hover:shadow-xl">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        Core Driving Factors
      </h2>

      <div className="space-y-3">
        {result.factors.map((factor, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/60 rounded-xl p-4 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:border-blue-500/30"
          >
            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
            <span className="text-xs leading-relaxed">{factor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeyFactors;