import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaChartArea, FaSearch, FaStar, FaRegStar, FaArrowUp, FaArrowDown } from "react-icons/fa";

function StockCharts() {
  const [symbol, setSymbol] = useState("AAPL");
  const [searchText, setSearchText] = useState("");
  const [timeframe, setTimeframe] = useState("1M");
  const [companyInfo, setCompanyInfo] = useState({ name: "Apple Inc.", price: 182.3, change: 1.45, pctChange: 0.8 });
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Popular companies preset list
  const presets = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "TSLA", name: "Tesla, Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "AMZN", name: "Amazon.com, Inc." },
  ];

  useEffect(() => {
    generateChartData();
    checkWatchlistStatus();
  }, [symbol, timeframe]);

  // Check if stock is in watchlist
  async function checkWatchlistStatus() {
    try {
      const res = await api.get("/watchlist");
      if (res.data.success) {
        const found = res.data.watchlist.some((item) => item.symbol.toUpperCase() === symbol.toUpperCase());
        setIsWatchlisted(found);
      }
    } catch (err) {
      console.log("Error checking watchlist:", err);
    }
  }

  // Toggle watchlist state
  const handleToggleWatchlist = async () => {
    try {
      setWatchlistLoading(true);
      if (isWatchlisted) {
        const res = await api.delete(`/watchlist/${symbol}`);
        if (res.data.success) setIsWatchlisted(false);
      } else {
        const res = await api.post("/watchlist", { symbol, name: companyInfo.name });
        if (res.data.success) setIsWatchlisted(true);
      }
    } catch (err) {
      console.log("Error toggling watchlist:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Generate mock prices deterministically based on stock symbol and timeframe
  const generateChartData = () => {
    const data = [];
    let count = 20;

    const sym = symbol.toUpperCase();
    const charVal = sym.charCodeAt(0) || 65;
    const profile = {
      AAPL: { name: "Apple Inc.", basePrice: 182.3, trend: 0.05, volatility: 1.5, change: 1.45, pctChange: 0.8 },
      NVDA: { name: "NVIDIA Corporation", basePrice: 875.12, trend: 0.8, volatility: 15, change: 24.15, pctChange: 2.84 },
      TSLA: { name: "Tesla, Inc.", basePrice: 175.46, trend: -0.05, volatility: 6, change: -4.2, pctChange: -2.34 },
      MSFT: { name: "Microsoft Corporation", basePrice: 421.9, trend: 0.12, volatility: 3, change: 3.12, pctChange: 0.74 },
      AMZN: { name: "Amazon.com, Inc.", basePrice: 180.1, trend: 0.08, volatility: 2.5, change: 1.15, pctChange: 0.64 },
    }[sym] || {
      name: `${sym} Technologies`,
      basePrice: charVal * 2.5,
      trend: (charVal % 3) === 0 ? -0.1 : 0.15,
      volatility: (charVal % 5) + 1.5,
      change: Number(((charVal * 2.5) * 0.015).toFixed(2)),
      pctChange: 1.5,
    };

    const { basePrice, trend, volatility } = profile;
    setCompanyInfo({
      name: profile.name,
      price: Number(basePrice.toFixed(2)),
      change: profile.change,
      pctChange: profile.pctChange,
    });

    if (timeframe === "1D") count = 12;
    else if (timeframe === "1W") count = 7;
    else if (timeframe === "1M") count = 20;
    else if (timeframe === "1Y") count = 50;

    let currentPrice = basePrice - (count * trend);
    for (let i = 0; i < count; i++) {
      const noise = (Math.sin(i / 2) + Math.cos(i / 3)) * volatility;
      currentPrice += trend + (Math.random() - 0.48) * volatility;
      const formattedPrice = Number(Math.max(1, currentPrice + noise).toFixed(2));
      
      let label = "";
      if (timeframe === "1D") label = `${9 + Math.floor(i / 2)}:${(i % 2) * 30 || "00"}`;
      else if (timeframe === "1W") label = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7];
      else if (timeframe === "1M") label = `Day ${i + 1}`;
      else if (timeframe === "1Y") label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(i / 4) % 12];

      data.push({ label, price: formattedPrice });
    }
    setChartData(data);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setSymbol(searchText.toUpperCase().trim());
      setSearchText("");
    }
  };

  // SVG Chart Calculations
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  const range = maxPrice - minPrice;

  const width = 600;
  const height = 280;
  const padding = 20;

  // Convert data points to SVG coordinates
  const points = chartData.map((d, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.price - minPrice) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  // Coordinates for the filled area under the line
  const areaPoints = points
    ? `${padding},${height - padding} ${points} ${width - padding},${height - padding}`
    : "";

  const isPositive = companyInfo.change >= 0;

  return (
    <div className="flex bg-slate-900 min-h-screen text-slate-100">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Top Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mt-6 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <FaChartArea className="text-blue-500" />
              Interactive Stock Charts
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Visualize real-time price trend patterns, scale historical windows, and manage your watchlist.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full xl:w-96">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                type="text"
                placeholder="Search stock symbol... (e.g. TSLA, NVDA)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/60 focus:border-blue-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Company Quick Presets Bar */}
        <div className="flex flex-wrap gap-2 mt-6">
          {presets.map((p) => (
            <button
              key={p.symbol}
              onClick={() => setSymbol(p.symbol)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                symbol.toUpperCase() === p.symbol
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                  : "bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/40"
              }`}
            >
              {p.symbol}
            </button>
          ))}
        </div>

        {/* Stock Status Board */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          
          {/* Main Info Board */}
          <div className="lg:col-span-2 bg-slate-800/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle, ${isPositive ? '#10b981' : '#ef4444'}, transparent)` }} />
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-blue-400 text-xs font-extrabold uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md">
                  {symbol.toUpperCase()}
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3">{companyInfo.name}</h2>
              </div>

              {/* Watchlist toggle */}
              <button
                onClick={handleToggleWatchlist}
                disabled={watchlistLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isWatchlisted
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/35 hover:bg-amber-500/25"
                    : "bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50"
                }`}
              >
                {isWatchlisted ? <FaStar className="text-amber-400" /> : <FaRegStar />}
                {isWatchlisted ? "Watchlisted" : "Add to Watchlist"}
              </button>
            </div>

            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-5xl font-black text-white">${companyInfo.price}</span>
              <span className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {isPositive ? "+" : ""}{companyInfo.change} ({isPositive ? "+" : ""}{companyInfo.pctChange}%)
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-800/20 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 block">Key Performance Indicators</span>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Day High", val: `$${(companyInfo.price * 1.025).toFixed(2)}` },
                { label: "Day Low", val: `$${(companyInfo.price * 0.975).toFixed(2)}` },
                { label: "Volume (Avg)", val: `${(companyInfo.price * 1.2).toFixed(1)}M` },
                { label: "Market Cap", val: `${(companyInfo.price * 15.4).toFixed(1)}B` },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-semibold block">{m.label}</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Interactive Chart Visualizer */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-3xl p-6 mt-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <FaChartArea className="text-blue-400" />
              Interactive Price Line
            </h3>
            
            {/* Timeframe Selectors */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/50">
              {["1D", "1W", "1M", "1Y"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                    timeframe === tf
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Price Chart */}
          <div className="w-full relative h-[300px] flex items-center justify-center">
            {chartData.length > 0 ? (
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
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

                {/* Filled Area */}
                {areaPoints && (
                  <polygon
                    points={areaPoints}
                    fill="url(#chartGradient)"
                  />
                )}

                {/* Main Trend Line */}
                {points && (
                  <polyline
                    fill="none"
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth="2.5"
                    points={points}
                    className="transition-all duration-500"
                  />
                )}

                {/* Labels along bottom axis */}
                {chartData.map((d, index) => {
                  // Only display every Nth label to prevent clustering
                  const step = Math.ceil(chartData.length / 5);
                  if (index % step !== 0 && index !== chartData.length - 1) return null;

                  const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
                  return (
                    <g key={index}>
                      <text
                        x={x}
                        y={height - 2}
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {d.label}
                      </text>
                      {/* Minor tick marks */}
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
              <p className="text-slate-500 italic text-sm">Generating chart data...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StockCharts;
