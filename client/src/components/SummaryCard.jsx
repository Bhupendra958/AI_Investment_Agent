import { FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function SummaryCard({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h2 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-2.5 relative z-10">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
          <FaFileAlt className="text-sm" />
        </div>
        Company Summary
      </h2>

      <p className="text-slate-300 text-xs leading-relaxed font-semibold relative z-10">
        {result.summary}
      </p>
    </motion.div>
  );
}

export default SummaryCard;