import { motion } from "framer-motion";
import { FaBrain, FaChartBar, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const steps = [
  { icon: <FaBrain />, label: "Company Overview", color: "from-blue-600 to-indigo-500" },
  { icon: <FaChartBar />, label: "Financial Analysis", color: "from-cyan-600 to-blue-500" },
  { icon: <FaShieldAlt />, label: "Risk Assessment", color: "from-violet-600 to-purple-500" },
  { icon: <FaCheckCircle />, label: "Final Decision", color: "from-emerald-600 to-cyan-500" },
];

function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 glass-card p-10 flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Background pulse glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 pointer-events-none"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Spinner ring */}
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-blue-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ borderTopColor: "#3b82f6" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-cyan-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ borderTopColor: "#06b6d4" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaBrain className="text-blue-400 text-xl" />
        </div>
      </div>

      <h3 className="text-xl font-black text-white tracking-tight mb-2">
        AI Pipeline Running...
      </h3>
      <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs leading-relaxed">
        LangGraph is orchestrating a 4-stage multi-agent research workflow
      </p>

      {/* Step indicators */}
      <div className="flex gap-4 flex-wrap justify-center">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.35 }}
            className="flex items-center gap-2.5 bg-slate-950/40 border border-white/5 px-4 py-2.5 rounded-2xl"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white text-xs shadow-md`}
            >
              {step.icon}
            </motion.div>
            <span className="text-xs text-slate-300 font-semibold">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Loader;
