import { motion } from "framer-motion";

function ConfidenceCard({ confidence }) {
  if (confidence === undefined || confidence === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h2 className="text-lg font-black text-white tracking-tight mb-6 relative z-10">
        Confidence Score Model
      </h2>

      {/* Progress Bar Container */}
      <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative z-10 p-0.5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full shadow-md relative"
        >
          {/* Overlay shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </motion.div>
      </div>
      
      <div className="text-center mt-6 relative z-10">
        <span className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent tracking-tight">
          {confidence}%
        </span>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1.5">
          Pipeline Agreement Level
        </p>
      </div>
    </motion.div>
  );
}

export default ConfidenceCard;