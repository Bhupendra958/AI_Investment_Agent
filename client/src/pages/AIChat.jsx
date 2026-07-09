import { useState, useEffect, useRef } from "react";
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
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 flex flex-col h-screen overflow-hidden">
        <Navbar />

        {/* Chat Container */}
        <div className="flex-1 rounded-2xl border border-slate-200/60 bg-white/60 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-xl mt-6 flex flex-col overflow-hidden relative">

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                <FaRobot className="text-xl animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Investment Assistant</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  Gemini-2.5-Flash Online
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-rose-500 p-2.5 rounded-xl hover:bg-rose-500/10 transition-all duration-200"
              title="Clear chat history"
            >
              <FaTrashAlt />
            </button>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => {
              const isAI = m.sender === "ai";
              return (
                <div key={i} className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isAI
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  }`}>
                    {isAI ? <FaRobot /> : <FaUser />}
                  </div>

                  <div className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                    isAI
                      ? "bg-slate-100/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50"
                      : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                  }`}>
                    <div className="whitespace-pre-line">{m.text}</div>
                    <span className={`block text-[10px] mt-2 text-right ${isAI ? "text-slate-400 dark:text-slate-500" : "text-blue-100"}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  <FaRobot />
                </div>
                <div className="bg-slate-100/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && !loading && (
            <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/50">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaInfoCircle className="text-blue-400" />
                Frequently Asked Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-600/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/40 hover:border-blue-500/30 transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
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
                className="flex-1 bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 focus:border-blue-500 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AIChat;
