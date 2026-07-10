import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/5 bg-slate-950/20 p-16 text-center backdrop-blur-md shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-cyan-500/[0.01]" />
      
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-inner"
      >
        <FaSearch className="text-2xl text-blue-400" />
      </motion.div>

      <h2 className="text-3xl font-black text-white tracking-tight">
        Start Research
      </h2>

      <p className="mt-3 text-slate-400 text-sm max-w-sm mx-auto font-medium">
        Search any company above to trigger our LangGraph AI multi-agent investment research pipeline.
      </p>
    </motion.div>
  );
}

export default EmptyState;