import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaNewspaper, FaRegClock, FaThumbsUp, FaThumbsDown, FaArrowRight, FaWaveSquare } from "react-icons/fa";

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      const res = await api.get("/news");
      if (res.data.success) {
        setArticles(res.data.news);
      }
    } catch (err) {
      console.log("Error loading news feed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaNewspaper className="text-blue-500" />
              AI Sentiment News Feed
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Real-time stock news aggregated with sentiment score analysis and market impact projections.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {articles.map((article) => {
              const isBullish = article.sentiment === "BULLISH";
              const isBearish = article.sentiment === "BEARISH";

              return (
                <div
                  key={article.id}
                  className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    {/* Header: source and date */}
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{article.source}</span>
                      <span className="flex items-center gap-1"><FaRegClock /> {article.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">
                      {article.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => navigate("/charts")}
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/25 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider"
                      >
                        {article.company}
                      </button>

                      {isBullish && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <FaThumbsUp /> BULLISH ({article.score}%)
                        </span>
                      )}
                      {isBearish && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <FaThumbsDown /> BEARISH ({article.score}%)
                        </span>
                      )}
                      {!isBullish && !isBearish && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                          <FaWaveSquare /> NEUTRAL ({article.score}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Impact block */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Expected Market Impact</span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                      {article.impact}
                    </p>

                    <button
                      onClick={() => navigate("/charts")}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-500 dark:text-slate-400 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-300"
                    >
                      Analyze {article.company} <FaArrowRight className="text-[10px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
