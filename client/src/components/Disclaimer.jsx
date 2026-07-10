import { FaExclamationTriangle } from "react-icons/fa";

function Disclaimer() {
  return (
    <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-5 flex items-start gap-3.5 shadow-inner">
      <div className="mt-0.5 w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
        <FaExclamationTriangle className="text-amber-400 text-xs" />
      </div>
      <div>
        <h3 className="font-black text-amber-300 text-xs uppercase tracking-wider">
          Disclaimer
        </h3>
        <p className="text-xs text-amber-200/60 mt-1.5 leading-relaxed font-medium">
          This report is generated using AI and should not be considered financial advice.
          Please conduct your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
}

export default Disclaimer;