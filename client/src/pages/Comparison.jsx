import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaExchangeAlt, FaChevronDown, FaCheckCircle, FaTimesCircle, FaChartBar, FaRegListAlt } from "react-icons/fa";

function Comparison() {
  const [history, setHistory] = useState([]);
  const [compA, setCompA] = useState("");
  const [compB, setCompB] = useState("");
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await api.get("/research");
      if (res.data.success) {
        setHistory(res.data.history);
        if (res.data.history.length >= 2) {
          // Auto select first two
          const first = res.data.history[0];
          const second = res.data.history[1];
          setCompA(first._id);
          setCompB(second._id);
          setDataA(first);
          setDataB(second);
        } else if (res.data.history.length === 1) {
          const first = res.data.history[0];
          setCompA(first._id);
          setDataA(first);
        }
      }
    } catch (err) {
      console.log("Error loading comparison options:", err);
    }
  }

  const handleSelectA = (id) => {
    setCompA(id);
    const selected = history.find((h) => h._id === id);
    setDataA(selected || null);
  };

  const handleSelectB = (id) => {
    setCompB(id);
    const selected = history.find((h) => h._id === id);
    setDataB(selected || null);
  };

  // Generate deterministic mock financials based on company name
  const getFinancials = (companyName) => {
    if (!companyName) return null;
    const length = companyName.length;
    
    // Deterministic generation
    const peRatio = ((length * 3.5) % 30 + 12).toFixed(1);
    const revenueGrowth = (((length * 7.5) % 25) + 3).toFixed(1);
    const profitMargin = (((length * 4.2) % 20) + 8).toFixed(1);
    const debtToEquity = ((length * 0.15) % 1.5 + 0.2).toFixed(2);
    
    return {
      peRatio,
      revenueGrowth: `${revenueGrowth}%`,
      profitMargin: `${profitMargin}%`,
      debtToEquity,
    };
  };

  const finA = dataA ? getFinancials(dataA.company) : null;
  const finB = dataB ? getFinancials(dataB.company) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaExchangeAlt className="text-blue-500" />
              Company Comparison
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Select two researched companies from your history to compare analysis side-by-side.
            </p>
          </div>
        </div>

        {/* Comparison Dropdowns */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Selector A */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/50 dark:border-slate-700/60 shadow p-5">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Company A</label>
            <div className="relative">
              <select
                value={compA}
                onChange={(e) => handleSelectA(e.target.value)}
                className="w-full bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 appearance-none focus:outline-none focus:border-blue-500 text-sm font-semibold"
              >
                <option value="">-- Choose Company --</option>
                {history.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.company} ({h.decision})
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
            </div>
          </div>

          {/* Selector B */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/50 dark:border-slate-700/60 shadow p-5">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Company B</label>
            <div className="relative">
              <select
                value={compB}
                onChange={(e) => handleSelectB(e.target.value)}
                className="w-full bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 appearance-none focus:outline-none focus:border-blue-500 text-sm font-semibold"
              >
                <option value="">-- Choose Company --</option>
                {history.map((h) => (
                  <option key={h._id} value={h._id} disabled={h._id === compA}>
                    {h.company} ({h.decision})
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
            </div>
          </div>
        </div>

        {/* Side by Side Results */}
        {!dataA && !dataB ? (
          <div className="flex flex-col items-center justify-center p-16 mt-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800">
            <FaExchangeAlt className="text-slate-300 dark:text-slate-600 text-5xl mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please perform research on companies first to compare them here.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            
            {/* Verdict Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card A */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/40 dark:border-slate-700/40 shadow p-6 flex flex-col justify-between">
                {dataA ? (
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Verdict</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{dataA.company}</h2>
                    <div className="flex items-center gap-2 mt-4">
                      {dataA.decision === "INVEST" ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FaCheckCircle className="text-sm" /> INVEST
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <FaTimesCircle className="text-sm" /> PASS
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                        Confidence: <strong className="text-slate-900 dark:text-white">{dataA.confidence}%</strong>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dataA.decision === "INVEST" ? "bg-emerald-500" : "bg-rose-500"}`}
                        style={{ width: `${dataA.confidence}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 text-sm italic">No company selected.</p>
                )}
              </div>

              {/* Card B */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/40 dark:border-slate-700/40 shadow p-6 flex flex-col justify-between">
                {dataB ? (
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Verdict</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{dataB.company}</h2>
                    <div className="flex items-center gap-2 mt-4">
                      {dataB.decision === "INVEST" ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FaCheckCircle className="text-sm" /> INVEST
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <FaTimesCircle className="text-sm" /> PASS
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                        Confidence: <strong className="text-slate-900 dark:text-white">{dataB.confidence}%</strong>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dataB.decision === "INVEST" ? "bg-emerald-500" : "bg-rose-500"}`}
                        style={{ width: `${dataB.confidence}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">No company selected.</p>
                )}
              </div>
            </div>

            {/* Summaries & Reasoning */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Summary A */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/30 dark:border-slate-800 shadow p-6">
                <h3 className="text-slate-900 dark:text-white font-bold text-base mb-3 flex items-center gap-2">
                  <FaRegListAlt className="text-blue-500" />
                  Analysis Summary
                </h3>
                {dataA ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{dataA.summary}</p>
                    <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block mb-1">Key Reason</span>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{dataA.reason}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 text-sm">No analysis details.</p>
                )}
              </div>

              {/* Summary B */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/30 dark:border-slate-800 shadow p-6">
                <h3 className="text-slate-900 dark:text-white font-bold text-base mb-3 flex items-center gap-2">
                  <FaRegListAlt className="text-blue-500" />
                  Analysis Summary
                </h3>
                {dataB ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{dataB.summary}</p>
                    <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block mb-1">Key Reason</span>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{dataB.reason}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 text-sm">No analysis details.</p>
                )}
              </div>
            </div>

            {/* Financial Performance Table Comparison */}
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/30 dark:border-slate-800 shadow p-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4 flex items-center gap-2">
                <FaChartBar className="text-cyan-500" />
                Financial Metric Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="py-3 text-slate-500 dark:text-slate-400 font-semibold">Metric</th>
                      <th className="py-3 text-slate-900 dark:text-white font-bold">{dataA ? dataA.company : "Company A"}</th>
                      <th className="py-3 text-slate-900 dark:text-white font-bold">{dataB ? dataB.company : "Company B"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">P/E Ratio (Valuation)</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finA ? finA.peRatio : "--"}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finB ? finB.peRatio : "--"}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Revenue Growth (YoY)</td>
                      <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{finA ? finA.revenueGrowth : "--"}</td>
                      <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{finB ? finB.revenueGrowth : "--"}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Net Profit Margin</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finA ? finA.profitMargin : "--"}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finB ? finB.profitMargin : "--"}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Debt to Equity Ratio</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finA ? finA.debtToEquity : "--"}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{finB ? finB.debtToEquity : "--"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Core Driving Factors */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Factors A */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/30 dark:border-slate-850 shadow p-6">
                <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Core Analysis Factors</h4>
                {dataA ? (
                  <ul className="space-y-3">
                    {dataA.factors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 text-sm">
                        <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 text-sm">No factors.</p>
                )}
              </div>

              {/* Factors B */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/30 dark:border-slate-850 shadow p-6">
                <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Core Analysis Factors</h4>
                {dataB ? (
                  <ul className="space-y-3">
                    {dataB.factors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 text-sm">
                        <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 text-sm">No factors.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Comparison;
