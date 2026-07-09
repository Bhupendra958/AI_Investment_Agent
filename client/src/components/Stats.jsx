import { FaChartLine, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function Stats({ total, invest, pass }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* Total Research */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/85 shadow-lg p-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
              Total Research
            </p>
            <h1 className="text-4xl font-black mt-2 text-blue-600 dark:text-blue-400">
              {total}
            </h1>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
            <FaChartLine className="text-3xl" />
          </div>
        </div>
      </div>

      {/* Invest */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/85 shadow-lg p-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
              INVEST Decision
            </p>
            <h1 className="text-4xl font-black mt-2 text-emerald-600 dark:text-emerald-400">
              {invest}
            </h1>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <FaCheckCircle className="text-3xl" />
          </div>
        </div>
      </div>

      {/* Pass */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/85 shadow-lg p-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
              PASS Decision
            </p>
            <h1 className="text-4xl font-black mt-2 text-rose-600 dark:text-rose-400">
              {pass}
            </h1>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400">
            <FaTimesCircle className="text-3xl" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Stats;