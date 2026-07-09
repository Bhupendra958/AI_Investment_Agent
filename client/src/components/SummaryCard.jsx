import { FaFileAlt } from "react-icons/fa";

function SummaryCard({ result }) {
  if (!result) return null;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 transition-all duration-350 hover:-translate-y-0.5 hover:shadow-xl">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <FaFileAlt className="text-blue-500 text-sm" />
        Company Summary
      </h2>

      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
        {result.summary}
      </p>
    </div>
  );
}

export default SummaryCard;