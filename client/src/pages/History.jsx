import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HistoryCard from "../components/HistoryCard";
import DecisionCard from "../components/DecisionCard";
import ConfidenceCard from "../components/ConfidenceCard";
import SummaryCard from "../components/SummaryCard";
import KeyFactors from "../components/KeyFactors";
import Disclaimer from "../components/Disclaimer";

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const res = await api.get("/research");
      setHistory(res.data.history || []);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to fetch history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <Navbar title="Research History" />

        {loading ? (
          <div className="flex items-center justify-center p-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <HistoryCard
              history={history}
              loadHistory={loadHistory}
              onSelect={setSelected}
            />

            {selected ? (
              <div className="space-y-6">
                <DecisionCard result={selected} />
                <ConfidenceCard confidence={selected.confidence} />
                <SummaryCard result={selected} />
                <KeyFactors result={selected} />
                <Disclaimer />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-8 flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Select a research item to view details, or{" "}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    run new research
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
