function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-200"></div>

        <p className="mt-5 text-lg font-semibold text-slate-700">
          AI is researching the company...
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Running multi-step analysis: overview -&gt; financials -&gt; risks -&gt; decision
        </p>
      </div>
    </div>
  );
}

export default Loader;
