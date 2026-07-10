import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPaperPlane, FaTrashAlt, FaRobot, FaUser, FaInfoCircle } from "react-icons/fa";

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function loadChatHistory() {
    try {
      const res = await api.get("/chat");
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.log("Error loading chat history:", err);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || loading) return;

    setInputText("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: msg, timestamp: new Date() },
    ]);

    try {
      const res = await api.post("/chat/message", { text: msg });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.log("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error connecting to the backend. Please check your network and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear your conversation history?")) return;
    try {
      setLoading(true);
      const res = await api.post("/chat/clear");
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.log("Error clearing chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What is the P/E ratio and how do I use it?",
    "Explain diversification in a portfolio.",
    "Is Apple (AAPL) a good investment right now?",
    "How does high inflation affect stock prices?",
  ];

  return (
    <div className="flex bg-slate-900 min-h-screen text-slate-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 flex flex-col h-screen overflow-hidden relative">
        {/* Glow backdrop detail */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <Navbar />

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 rounded-3xl border border-white/5 bg-slate-950/40 shadow-2xl mt-6 flex flex-col overflow-hidden relative backdrop-blur-3xl"
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between bg-slate-950/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/10 relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 blur-sm opacity-50" />
                <FaRobot className="text-xl relative z-10 animate-bounce" style={{ animationDuration: "3s" }} />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight">AI Investment Assistant</h2>
                <p className="text-slate-400 text-xs flex items-center gap-2 mt-0.5 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Gemini Agent Online
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearChat}
              className="text-slate-400 hover:text-rose-400 p-3 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <FaTrashAlt className="text-sm" />
            </motion.button>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => {
                const isAI = m.sender === "ai";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 relative shadow-md ${
                      isAI
                        ? "bg-slate-800 border border-white/10 text-cyan-400"
                        : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white"
                    }`}>
                      {isAI ? <FaRobot /> : <FaUser />}
                    </div>

                    <div className={`max-w-xl rounded-2xl p-4.5 text-sm leading-relaxed border relative shadow-lg ${
                      isAI
                        ? "bg-slate-900/60 text-slate-100 border-white/5"
                        : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-blue-500/5"
                    }`}>
                      {/* Top border highlight for AI response card */}
                      {isAI && (
                        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      )}
                      <div className="whitespace-pre-line font-medium">{m.text}</div>
                      <span className={`block text-[9px] font-semibold uppercase tracking-wider mt-2.5 text-right ${isAI ? "text-slate-500" : "text-cyan-100/75"}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-white/10 text-cyan-400 flex items-center justify-center text-sm font-bold">
                  <FaRobot />
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && !loading && (
            <div className="px-6 py-5 bg-slate-950/20 border-t border-white/5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-blue-400" />
                Frequently Asked Topics
              </p>
              <div className="flex flex-wrap gap-2.5">
                {suggestions.map((s, i) => (
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.08)", borderColor: "rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    key={i}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs bg-white/[0.02] text-slate-300 hover:text-blue-400 px-4 py-2.5 rounded-2xl border border-white/5 transition-all cursor-pointer font-medium"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-white/5 bg-slate-950/40 flex-shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-3"
            >
              <input
                type="text"
                placeholder="Ask your investment assistant..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="flex-1 bg-white/[0.03] border border-white/10 focus:border-blue-500/50 focus:bg-blue-500/[0.01] focus:ring-4 focus:ring-blue-500/5 text-white rounded-2xl px-5 py-3.5 text-sm focus:outline-none placeholder-slate-500 transition-all font-medium"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={!inputText.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-2xl disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center cursor-pointer"
              >
                <FaPaperPlane className="text-sm" />
              </motion.button>
            </form>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default AIChat;
