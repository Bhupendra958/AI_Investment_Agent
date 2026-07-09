import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBox({ handleResearch, loading }) {
  const [company, setCompany] = useState("");

  const submit = () => {
    if (loading || !company.trim()) return;
    handleResearch(company);
    setCompany("");
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 transition-all duration-350 hover:-translate-y-0.5 hover:shadow-xl">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Research Target Company</h2>
      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
        Enter a company name to execute the LangGraph AI-powered invest or pass recommendation pipeline.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Apple, Tesla, Microsoft, NVIDIA..."
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 bg-slate-50/50 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-75 disabled:-translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
              Researching...
            </span>
          ) : (
            "Analyze Company"
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchBox;
