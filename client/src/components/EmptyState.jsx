import { FaSearch } from "react-icons/fa";

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 shadow-lg p-16 text-center transition-all duration-300 hover:shadow-2xl">

      <FaSearch
        className="mx-auto text-6xl text-blue-500 mb-5"
      />

      <h2 className="text-3xl font-bold text-slate-900">
        Start Research
      </h2>

      <p className="mt-4 text-slate-500">
        Search any company to generate an AI investment report.
      </p>

    </div>
  );
}

export default EmptyState;