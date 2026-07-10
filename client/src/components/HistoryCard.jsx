import api from "../services/api";
import { FaTrash, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function HistoryCard({ history, loadHistory, onSelect }) {
  const deleteResearch = async (id, e) => {
    e.stopPropagation();

    const ok = window.confirm("Delete this research?");
    if (!ok) return;

    try {
      await api.delete(`/research/${id}`);
      loadHistory();
    } catch (err) {
      console.log(err);
      alert("Unable to delete");
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h2 className="text-lg font-black text-white tracking-tight mb-6 relative z-10">Recent Research Analyses</h2>

      {history.length === 0 ? (
        <p className="text-slate-500 text-xs italic relative z-10">No research run yet. Search a company above to run analysis.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 relative z-10"
        >
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onClick={() => onSelect?.(item)}
                whileHover={{ y: -2, borderColor: "rgba(59, 130, 246, 0.25)", backgroundColor: "rgba(255, 255, 255, 0.015)" }}
                className="border border-white/5 rounded-2xl p-4 flex justify-between items-center bg-slate-950/20 hover:shadow-lg cursor-pointer transition-all duration-200"
              >
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">{item.company}</h3>

                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                    <FaCalendarAlt className="text-[9px] text-slate-500" />
                    {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>

                  <div className="flex items-center gap-3.5 mt-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                        item.decision === "INVEST"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/15"
                      }`}
                    >
                      {item.decision}
                    </span>

                    <span className="text-[10px] text-slate-400 font-semibold">
                      {item.confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, color: "#f43f5e", backgroundColor: "rgba(244, 63, 94, 0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => deleteResearch(item._id, e)}
                    className="text-slate-400 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 transition cursor-pointer"
                    aria-label="Delete research"
                  >
                    <FaTrash className="text-[10px]" />
                  </motion.button>
                  <FaChevronRight className="text-slate-500 text-[10px]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default HistoryCard;
