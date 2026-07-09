import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaSearch,
  FaPercentage,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaUserAstronaut,
  FaHistory,
  FaChartLine,
  FaSyncAlt
} from "react-icons/fa";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadAdminStats(refresh = false) {
    try {
      if (refresh) setIsRefreshing(true);
      else setLoading(true);
      
      setError("");
      const res = await api.get("/admin/stats");
      if (res.data.success) {
        setData(res.data.stats);
      } else {
        setError("Failed to fetch administrative data.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Access denied. Admin rights required.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadAdminStats();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-100 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Sidebar />
      
      <div className="ml-64 flex-1 p-8 z-10 relative max-h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          <div className="flex items-center justify-between mb-8">
            <Navbar title="Intelligence Command Center" />
            
            {!loading && !error && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadAdminStats(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all shadow-lg"
              >
                <FaSyncAlt className={`${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
                {isRefreshing ? 'Syncing...' : 'Live Sync'}
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-96 items-center justify-center rounded-3xl border border-white/5 bg-black/40 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-emerald-500/5 animate-pulse" />
                <div className="relative flex flex-col items-center">
                  <div className="h-16 w-16 relative">
                    <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-400 animate-[spin_1.5s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-emerald-400 animate-[spin_2s_linear_infinite_reverse]" />
                    <FaChartLine className="absolute inset-0 m-auto text-slate-400 animate-pulse" size={20} />
                  </div>
                  <span className="mt-6 text-sm font-medium tracking-widest text-slate-400 uppercase">Synthesizing Admin Data...</span>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 shadow-lg shadow-rose-900/20 backdrop-blur-xl"
              >
                <div className="p-3 bg-rose-500/20 rounded-full mr-4">
                  <FaTimesCircle className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-100">Access Denied</h3>
                  <p className="text-sm font-medium text-rose-300/80 mt-1">{error}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {/* Stats Row */}
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Card 1 */}
                  <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-blue-400/50 hover:shadow-blue-500/10 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-500">
                      <FaUsers size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/30 text-blue-400">
                          <FaUsers size={24} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400/70 bg-blue-400/10 px-3 py-1 rounded-full">Network</span>
                      </div>
                      <div>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">
                          {data?.totalUsers ?? 0}
                        </h1>
                        <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">Total Investors</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-violet-400/50 hover:shadow-violet-500/10 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-500">
                      <FaSearch size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/30 text-violet-400">
                          <FaSearch size={24} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400/70 bg-violet-400/10 px-3 py-1 rounded-full">Queries</span>
                      </div>
                      <div>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-100 to-violet-400">
                          {data?.totalSearches ?? 0}
                        </h1>
                        <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">Global Searches</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-emerald-400/50 hover:shadow-emerald-500/10 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-500">
                      <FaPercentage size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-400">
                          <FaPercentage size={24} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/70 bg-emerald-400/10 px-3 py-1 rounded-full">Accuracy</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-emerald-400">
                            {data?.averageConfidence ?? 0}
                          </h1>
                          <span className="text-2xl font-bold text-emerald-500/50">%</span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">Avg Confidence</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Left Column - Companies (Takes up 2 cols) */}
                  <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl lg:col-span-2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                    
                    <div className="bg-black/40 rounded-[22px] p-6 sm:p-8 h-full relative z-10">
                      <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 text-blue-400">
                            <FaBuilding size={20} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">Market Leaders</h2>
                            <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Most Researched Entities</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/50 rounded-full p-1 border border-white/5">
                          <span className="px-3 py-1 text-xs font-bold text-white bg-blue-500/20 rounded-full border border-blue-500/30">Top {data?.popularCompanies?.length || 0}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto custom-scrollbar pr-2">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                          <thead>
                            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                              <th className="pb-2 pl-4 font-medium">Asset</th>
                              <th className="pb-2 text-center font-medium">Volume</th>
                              <th className="pb-2 text-center font-medium">AI Confidence</th>
                              <th className="pb-2 text-right pr-4 font-medium">Sentiment Split</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.popularCompanies?.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="py-12 text-center text-slate-500 font-medium">
                                  No market data aggregated yet.
                                </td>
                              </tr>
                            ) : (
                              data?.popularCompanies?.map((item, idx) => (
                                <tr key={idx} className="group">
                                  <td className="py-4 pl-4 rounded-l-2xl bg-white/[0.03] border-y border-l border-white/5 group-hover:bg-white/[0.06] transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/10 group-hover:border-blue-400/30 transition-colors">
                                        {item.company.substring(0, 2).toUpperCase()}
                                      </div>
                                      <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.company}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center bg-white/[0.03] border-y border-white/5 group-hover:bg-white/[0.06] transition-colors">
                                    <span className="font-mono text-sm font-semibold text-slate-300">{item.count}</span>
                                  </td>
                                  <td className="py-4 text-center bg-white/[0.03] border-y border-white/5 group-hover:bg-white/[0.06] transition-colors">
                                    <div className="flex justify-center items-center">
                                      <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                          <path
                                            className="text-slate-800"
                                            strokeWidth="3"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          />
                                          <path
                                            className={`${item.avgConfidence > 75 ? 'text-emerald-400' : item.avgConfidence > 50 ? 'text-amber-400' : 'text-rose-400'} transition-all duration-1000 ease-out`}
                                            strokeDasharray={`${item.avgConfidence}, 100`}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          />
                                        </svg>
                                        <span className="absolute text-[10px] font-bold text-slate-300">{item.avgConfidence}%</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 pr-4 rounded-r-2xl bg-white/[0.03] border-y border-r border-white/5 group-hover:bg-white/[0.06] transition-colors text-right">
                                    <div className="flex justify-end gap-2 text-xs">
                                      <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                          <FaCheckCircle size={10} /> <span className="font-bold">{item.investCount}</span> <span className="text-[9px] uppercase opacity-70">Buy</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                          <FaTimesCircle size={10} /> <span className="font-bold">{item.passCount}</span> <span className="text-[9px] uppercase opacity-70">Pass</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Activities (Takes up 1 col) */}
                  <div className="space-y-8">
                    
                    {/* Recent Users */}
                    <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                      <div className="bg-black/40 rounded-[22px] p-6 h-full relative z-10 transition-colors group-hover:bg-black/30">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            <FaUserAstronaut size={16} />
                          </div>
                          <h3 className="text-base font-bold text-white tracking-wide">New Recruits</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {data?.recentUsers?.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No users found.</p>
                          ) : (
                            data?.recentUsers?.map((user, i) => (
                              <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={user._id} 
                                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.05] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-200">{user.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate w-24 sm:w-auto">{user.email}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider uppercase border ${user.role === "admin" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                                  {user.role}
                                </span>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Recent Searches */}
                    <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                      <div className="bg-black/40 rounded-[22px] p-6 h-full relative z-10 transition-colors group-hover:bg-black/30">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <FaHistory size={16} />
                          </div>
                          <h3 className="text-base font-bold text-white tracking-wide">Live Feed</h3>
                        </div>
                        
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                          {data?.recentSearches?.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
                          ) : (
                            data?.recentSearches?.map((search, i) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={search._id} 
                                className="relative flex items-center justify-between group/item"
                              >
                                <div className="flex items-center gap-4 w-full">
                                  {/* Timeline dot */}
                                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#050505] z-10 ${search.decision === "INVEST" ? "bg-emerald-400" : "bg-rose-400"} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                  
                                  <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.06] hover:border-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="text-sm font-bold text-slate-100">{search.company}</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border ${search.decision === "INVEST" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                                        {search.decision}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-slate-500 font-medium">{search.user?.name || "Unknown"}</span>
                                      <span className="text-slate-400 font-bold bg-black/40 px-2 py-0.5 rounded-md border border-white/5">{search.confidence}%</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Global styles for custom scrollbar in this component only if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

export default AdminDashboard;
