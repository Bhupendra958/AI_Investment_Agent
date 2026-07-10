import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function KeyFactors({ result }) {
  if (!result || !result.factors) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h2 className="text-lg font-black text-white tracking-tight mb-6 relative z-10">
        Core Driving Factors
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 relative z-10"
      >
        {result.factors.map((factor, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ x: 4, borderColor: "rgba(59, 130, 246, 0.2)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
            className="flex items-start gap-3.5 bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-slate-300 transition-all duration-200"
          >
            <FaCheckCircle className="text-emerald-400 text-sm mt-0.5 flex-shrink-0" />
            <span className="text-xs leading-relaxed font-semibold">{factor}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default KeyFactors;