import { FaChartLine, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function Stats({ total, invest, pass }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const statItems = [
    {
      title: "Total Research",
      value: total,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      title: "INVEST Decision",
      value: invest,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
      icon: <FaCheckCircle className="text-3xl" />,
    },
    {
      title: "PASS Decision",
      value: pass,
      colorClass: "text-rose-500",
      bgClass: "bg-rose-500/10",
      icon: <FaTimesCircle className="text-3xl" />,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-3 gap-6"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
          className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 relative overflow-hidden backdrop-blur-md shadow-xl transition-all"
        >
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {item.title}
              </p>
              <h1 className={`text-4.5xl font-black mt-2 tracking-tight ${item.colorClass}`}>
                {item.value}
              </h1>
            </div>
            <div className={`p-4 rounded-2xl ${item.bgClass} ${item.colorClass} shadow-inner`}>
              {item.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Stats;