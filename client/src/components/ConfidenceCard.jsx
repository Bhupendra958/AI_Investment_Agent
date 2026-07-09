function ConfidenceCard({ confidence }) {
  if (confidence === undefined || confidence === null) return null;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 transition-all duration-350 hover:-translate-y-0.5 hover:shadow-xl">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        Confidence Score Model
      </h2>

      <div className="w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-800">
        <div
          className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-md"
          style={{
            width: `${confidence}%`,
          }}
        ></div>
      </div>
      
      <div className="text-center mt-6">
        <span className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          {confidence}%
        </span>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
          Pipeline Agreement Level
        </p>
      </div>
    </div>
  );
}

export default ConfidenceCard;