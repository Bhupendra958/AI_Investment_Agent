import api from "../services/api";
import { FaTrash, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

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

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 transition-all duration-350 hover:shadow-xl">
      <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Recent Research Analyses</h2>

      {history.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-xs italic">No research run yet. Search a company above to run analysis.</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelect?.(item)}
              className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/20 hover:border-blue-500/30 dark:hover:border-blue-500/30 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.company}</h3>

                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <FaCalendarAlt className="text-[8px]" />
                  {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.decision === "INVEST"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/15"
                    }`}
                  >
                    {item.decision}
                  </span>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {item.confidence}% confidence
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => deleteResearch(item._id, e)}
                  className="text-slate-400 hover:text-rose-500 p-2.5 rounded-lg hover:bg-rose-500/10 transition"
                  aria-label="Delete research"
                >
                  <FaTrash className="text-xs" />
                </button>
                <FaChevronRight className="text-slate-400 text-[10px] group-hover:text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryCard;
