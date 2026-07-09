import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaStar, FaTrashAlt, FaChartLine, FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbolInput, setSymbolInput] = useState("");
  const [prices, setPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadWatchlist();
  }, []);

  // Simulate live price fluctuations
  useEffect(() => {
    if (watchlist.length === 0) return;
    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        watchlist.forEach((item) => {
          const sym = item.symbol;
          if (next[sym]) {
            const current = next[sym].price;
            const changePct = (Math.random() - 0.5) * 0.006;
            const delta = current * changePct;
            const newPrice = Number((current + delta).toFixed(2));
            const totalChange = Number((next[sym].baseChange + delta).toFixed(2));
            const pctChange = Number(((totalChange / (current - totalChange)) * 100).toFixed(2));
            const dir = delta >= 0 ? "up" : "down";
            next[sym] = { price: newPrice, change: totalChange, pctChange, direction: dir };
          }
        });
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [watchlist]);

  async function loadWatchlist() {
    try {
      setLoading(true);
      const res = await api.get("/watchlist");
      if (res.data.success) {
        setWatchlist(res.data.watchlist);
        const initialPrices = {};
        res.data.watchlist.forEach((item) => {
          const seed = item.symbol.length;
          const basePrice = ((seed * 45) % 350) + 40;
          const baseChange = ((seed * 3.5) % 15) - 5;
          const pctChange = (baseChange / basePrice) * 100;
          initialPrices[item.symbol] = {
            price: Number(basePrice.toFixed(2)),
            change: Number(baseChange.toFixed(2)),
            pctChange: Number(pctChange.toFixed(2)),
            direction: "none",
          };
        });
        setPrices(initialPrices);
      }
    } catch (err) {
      console.log("Error fetching watchlist:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddStock = async (e) => {
    e.preventDefault();
    const sym = symbolInput.toUpperCase().trim();
    if (!sym) return;

    try {
      setLoading(true);
      const name = `${sym} Technologies Inc.`;
      const res = await api.post("/watchlist", { symbol: sym, name });
      if (res.data.success) {
        setSymbolInput("");
        loadWatchlist();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (sym) => {
    try {
      const res = await api.delete(`/watchlist/${sym}`);
      if (res.data.success) {
        setWatchlist((prev) => prev.filter((item) => item.symbol !== sym));
      }
    } catch (err) {
      console.log("Error removing stock:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaStar className="text-amber-400" />
              My Watchlist
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Monitor key stock price performance metrics with live-simulated updates and instant charts.
            </p>
          </div>

          <form onSubmit={handleAddStock} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter symbol (e.g. AMD)"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              className="bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 focus:border-blue-500 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-xs focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FaPlus /> Add
            </button>
          </form>
        </div>

        {loading && watchlist.length === 0 ? (
          <div className="flex items-center justify-center p-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 mt-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800">
            <FaStar className="text-slate-300 dark:text-slate-700 text-5xl mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Your Watchlist is empty.</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-sm text-center">
              Add tickers above to compile your watch list.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider font-extrabold">
                    <th className="pb-4">Company</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Change</th>
                    <th className="pb-4">Pct Change</th>
                    <th className="pb-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {watchlist.map((item) => {
                    const priceInfo = prices[item.symbol] || { price: 0, change: 0, pctChange: 0, direction: "none" };
                    const isPositive = priceInfo.change >= 0;

                    let blinkClass = "transition-all duration-500";
                    if (priceInfo.direction === "up") blinkClass += " text-emerald-600 dark:text-emerald-400";
                    if (priceInfo.direction === "down") blinkClass += " text-rose-600 dark:text-rose-400";

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
                        <td className="py-4">
                          <div>
                            <span className="text-slate-900 dark:text-white font-extrabold text-sm block group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-xs block">{item.name}</span>
                          </div>
                        </td>

                        <td className={`py-4 font-bold text-sm text-slate-900 dark:text-white ${blinkClass}`}>
                          ${priceInfo.price.toFixed(2)}
                        </td>

                        <td className={`py-4 font-bold text-sm ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          <span className="flex items-center gap-1">
                            {isPositive ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                            {isPositive ? "+" : ""}{priceInfo.change}
                          </span>
                        </td>

                        <td className="py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}>
                            {isPositive ? "+" : ""}{priceInfo.pctChange}%
                          </span>
                        </td>

                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate("/charts")}
                              className="text-slate-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-500/10 transition-all duration-200"
                              title="View Chart"
                            >
                              <FaChartLine />
                            </button>
                            <button
                              onClick={() => handleRemoveStock(item.symbol)}
                              className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-all duration-200"
                              title="Remove from Watchlist"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
