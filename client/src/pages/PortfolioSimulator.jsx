import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaBriefcase, FaHistory, FaUndo, FaChartLine, FaArrowUp, FaArrowDown, FaPlusCircle, FaMinusCircle } from "react-icons/fa";

function PortfolioSimulator() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("holdings");
  const [livePrices, setLivePrices] = useState({});

  // Buy/Sell form state
  const [tradeForm, setTradeForm] = useState({
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 10,
    price: 182.30,
    type: "BUY",
  });

  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.30 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.12 },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 175.46 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 421.90 },
    { symbol: "AMZN", name: "Amazon.com, Inc.", price: 180.10 },
  ];

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Fluctuating prices to simulate a live market
  useEffect(() => {
    if (!portfolio || portfolio.holdings.length === 0) return;
    const interval = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        portfolio.holdings.forEach((h) => {
          const sym = h.symbol;
          if (next[sym]) {
            const current = next[sym];
            const change = (Math.random() - 0.5) * 0.005; // max 0.25% change
            next[sym] = Number(Math.max(1, current * (1 + change)).toFixed(2));
          }
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [portfolio]);

  async function loadPortfolio() {
    try {
      setLoading(true);
      const res = await api.get("/portfolio");
      if (res.data.success) {
        const port = res.data.portfolio;
        setPortfolio(port);

        // Initialize live prices from averages
        const initialPrices = {};
        port.holdings.forEach((h) => {
          initialPrices[h.symbol] = h.avgBuyPrice;
        });
        setLivePrices(initialPrices);
      }
    } catch (err) {
      console.log("Error loading portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleQuickStockSelect = (stock) => {
    setTradeForm({
      ...tradeForm,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
    });
  };

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    const { symbol, name, shares, price, type } = tradeForm;
    if (!symbol || shares <= 0 || price <= 0) {
      alert("Please provide valid trade details.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = type === "BUY" ? "/portfolio/buy" : "/portfolio/sell";
      const res = await api.post(endpoint, {
        symbol: symbol.toUpperCase(),
        name,
        shares: Number(shares),
        price: Number(price),
      });

      if (res.data.success) {
        setPortfolio(res.data.portfolio);
        // Refresh live price tracking
        const nextPrices = { ...livePrices };
        nextPrices[symbol.toUpperCase()] = Number(price);
        setLivePrices(nextPrices);
        alert(`${type} order completed successfully!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Trade execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPortfolio = async () => {
    if (!window.confirm("This will erase all holdings and transaction history, resetting cash back to $100,000. Proceed?")) return;
    try {
      setLoading(true);
      const res = await api.post("/portfolio/reset");
      if (res.data.success) {
        setPortfolio(res.data.portfolio);
        setLivePrices({});
        alert("Portfolio reset completed!");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations for dashboard stats
  const cash = portfolio?.cash || 100000;
  const holdingsVal = portfolio
    ? portfolio.holdings.reduce((sum, h) => sum + h.shares * (livePrices[h.symbol] || h.avgBuyPrice), 0)
    : 0;
  const totalValue = cash + holdingsVal;
  
  // Starting value is $100,000
  const initialValue = 100000;
  const totalGain = totalValue - initialValue;
  const totalGainPct = (totalGain / initialValue) * 100;
  const isProfit = totalGain >= 0;

  // SVG Line Chart calculations for portfolio value history
  const historyData = portfolio?.valueHistory || [];
  const historyValues = historyData.map((h) => h.totalValue);
  const minVal = Math.min(...historyValues, initialValue) * 0.99;
  const maxVal = Math.max(...historyValues, initialValue) * 1.01;
  const valRange = maxVal - minVal || 100;

  const width = 600;
  const height = 220;
  const padding = 20;

  const points = historyData.map((h, i) => {
    const x = padding + (i / Math.max(1, historyData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((h.totalValue - minVal) / valRange) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = points
    ? `${padding},${height - padding} ${points} ${width - padding},${height - padding}`
    : "";

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Top Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaBriefcase className="text-blue-500" />
              Portfolio Simulator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Virtual paper-trading simulation desk initialized with $100,000 cash balance.
            </p>
          </div>

          <button
            onClick={handleResetPortfolio}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-rose-500/35 text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaUndo className="text-[10px]" /> {loading ? "Working..." : "Reset Simulator"}
          </button>
        </div>

        {/* Dashboard Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          
          {/* Net Asset Value */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow p-5">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Net Asset Value</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`flex items-center gap-1 text-[10px] font-bold mt-2 ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isProfit ? <FaArrowUp /> : <FaArrowDown />}
              {isProfit ? "+" : ""}{totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isProfit ? "+" : ""}{totalGainPct.toFixed(2)}%)
            </span>
          </div>

          {/* Cash Balance */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow p-5">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Cash Balance</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-2">Ready to deploy cash</span>
          </div>

          {/* Holdings Value */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow p-5">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Holdings Value</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">${holdingsVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-2">Invested capital</span>
          </div>

          {/* Holdings Count */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow p-5">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Total Positions</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">{portfolio?.holdings.length || 0}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-2">Active holdings</span>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 mt-8 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "holdings", label: "My Holdings" },
            { id: "trade", label: "Order Desk" },
            { id: "history", label: "Transaction History" },
            { id: "chart", label: "Performance Trend" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-1 text-sm font-bold border-b-2 transition-all duration-200 ${
                activeTab === t.id
                  ? "border-blue-500 text-blue-600 dark:text-white"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-6">
          
          {/* holdings tab */}
          {activeTab === "holdings" && (
            portfolio?.holdings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/10 dark:border-slate-800 shadow p-16 flex flex-col items-center justify-center text-center">
                <FaBriefcase className="text-slate-300 dark:text-slate-700 text-5xl mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">You don't own any stocks yet.</p>
                <button
                  onClick={() => setActiveTab("trade")}
                  className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Go to Order Desk
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-4">Company</th>
                        <th className="pb-4">Shares</th>
                        <th className="pb-4">Avg Buy Price</th>
                        <th className="pb-4">Live Price</th>
                        <th className="pb-4">Total Value</th>
                        <th className="pb-4">P&L</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {portfolio?.holdings.map((h) => {
                        const livePrice = livePrices[h.symbol] || h.avgBuyPrice;
                        const currentVal = h.shares * livePrice;
                        const totalCost = h.shares * h.avgBuyPrice;
                        const gain = currentVal - totalCost;
                        const gainPct = (gain / totalCost) * 100;
                        const isHoldingProfit = gain >= 0;

                        return (
                          <tr key={h._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                            <td className="py-4">
                              <span className="text-slate-900 dark:text-white font-extrabold text-sm block">{h.symbol}</span>
                              <span className="text-slate-400 dark:text-slate-500 text-xs block">{h.name}</span>
                            </td>
                            <td className="py-4 font-semibold text-slate-900 dark:text-white">{h.shares}</td>
                            <td className="py-4 font-semibold text-slate-600 dark:text-slate-300">${h.avgBuyPrice.toFixed(2)}</td>
                            <td className="py-4 font-semibold text-slate-900 dark:text-white">${livePrice.toFixed(2)}</td>
                            <td className="py-4 font-bold text-slate-900 dark:text-white">${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`py-4 font-bold ${isHoldingProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              {isHoldingProfit ? "+" : ""}{gainPct.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* trade tab */}
          {activeTab === "trade" && (
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Order Desk Form */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6">
                <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">Execute Order</h3>
                <form onSubmit={handleExecuteTrade} className="space-y-4">
                  {/* BUY / SELL Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <button
                      type="button"
                      onClick={() => setTradeForm({ ...tradeForm, type: "BUY" })}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          tradeForm.type === "BUY"
                            ? "bg-emerald-500 text-white shadow-md font-extrabold"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                      <FaPlusCircle className="inline mr-1 text-xs" /> BUY Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeForm({ ...tradeForm, type: "SELL" })}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          tradeForm.type === "SELL"
                            ? "bg-rose-500 text-white shadow-md font-extrabold"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                      <FaMinusCircle className="inline mr-1 text-xs" /> SELL Stock
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">Symbol</label>
                      <input
                        type="text"
                        value={tradeForm.symbol}
                        onChange={(e) => setTradeForm({ ...tradeForm, symbol: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">Company Name</label>
                      <input
                        type="text"
                        value={tradeForm.name}
                        onChange={(e) => setTradeForm({ ...tradeForm, name: e.target.value })}
                        className="w-full bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">Shares</label>
                      <input
                        type="number"
                        min="1"
                        value={tradeForm.shares}
                        onChange={(e) => setTradeForm({ ...tradeForm, shares: Math.max(1, parseInt(e.target.value) || 0) })}
                        className="w-full bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">Execution Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={tradeForm.price}
                        onChange={(e) => setTradeForm({ ...tradeForm, price: Math.max(0.01, parseFloat(e.target.value) || 0) })}
                        className="w-full bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Estimated Cost calculation */}
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Estimated Total Value:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold text-sm">${(tradeForm.shares * tradeForm.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                      tradeForm.type === "BUY"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                        : "bg-gradient-to-r from-rose-600 to-pink-500"
                    } disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0`}
                  >
                    {loading ? "Processing..." : `Execute ${tradeForm.type} Order`}
                  </button>
                </form>
              </div>

              {/* Presets side menu */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow p-6">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 block">Quick Presets</span>
                <div className="space-y-3">
                  {popularStocks.map((p) => (
                    <button
                      key={p.symbol}
                      onClick={() => handleQuickStockSelect(p)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/60 text-xs transition-all duration-200"
                    >
                      <div className="text-left">
                        <span className="text-slate-900 dark:text-white font-bold block">{p.symbol}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] block">{p.name}</span>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 font-bold">${p.price}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* history tab */}
          {activeTab === "history" && (
            !portfolio || portfolio.transactions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/10 dark:border-slate-800 shadow p-16 flex flex-col items-center justify-center text-center">
                <FaHistory className="text-slate-300 dark:text-slate-700 text-5xl mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">No transactions recorded yet.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Company</th>
                        <th className="pb-4">Type</th>
                        <th className="pb-4">Shares</th>
                        <th className="pb-4">Execution Price</th>
                        <th className="pb-4">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {portfolio.transactions.map((t) => {
                        const isBuy = t.type === "BUY";
                        const total = t.shares * t.price;
                        return (
                          <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                            <td className="py-4 text-xs text-slate-400 dark:text-slate-400">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="py-4 font-semibold text-slate-900 dark:text-white">{t.symbol}</td>
                            <td className="py-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                isBuy ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-slate-900 dark:text-white">{t.shares}</td>
                            <td className="py-4 font-semibold text-slate-600 dark:text-slate-300">${t.price.toFixed(2)}</td>
                            <td className="py-4 font-bold text-slate-900 dark:text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* chart tab */}
          {activeTab === "chart" && (
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-6 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Portfolio Performance Curve
              </h3>

              <div className="w-full relative h-[250px] flex items-center justify-center">
                {historyData.length > 0 ? (
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="portGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* horizontal grids */}
                    {[0.25, 0.5, 0.75].map((ratio, index) => (
                      <line
                        key={index}
                        x1={padding}
                        y1={padding + ratio * (height - padding * 2)}
                        x2={width - padding}
                        y2={padding + ratio * (height - padding * 2)}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                    ))}

                    {/* Gradient block */}
                    {areaPoints && (
                      <polygon
                        points={areaPoints}
                        fill="url(#portGradient)"
                      />
                    )}

                    {/* Value line */}
                    {points && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        points={points}
                      />
                    )}

                    {/* Axes Ticks */}
                    {historyData.map((d, index) => {
                      const step = Math.ceil(historyData.length / 6);
                      if (index % step !== 0 && index !== historyData.length - 1) return null;

                      const x = padding + (index / Math.max(1, historyData.length - 1)) * (width - padding * 2);
                      return (
                        <g key={index}>
                          <text
                            x={x}
                            y={height - 2}
                            fill="#64748b"
                            fontSize="8"
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            {new Date(d.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </text>
                          <line
                            x1={x}
                            y1={height - padding}
                            x2={x}
                            y2={height - padding - 4}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic text-xs">Awaiting data...</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default PortfolioSimulator;
