import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaChartLine, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";

function Login() {
  const auth = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      auth.login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/google/login", {
        credential: credentialResponse.credential,
      });
      auth.login(res.data.token, res.data.user);
    } catch (err) {
      setError("Google Login Failed. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3b82f6, transparent)", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10b981, transparent)", transform: "translate(30%, 30%)" }} />

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
              <FaChartLine className="text-white text-xl" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">AI Investment Agent</span>
          </div>
          <p className="text-slate-400 text-sm ml-14">Powered by LangGraph + Gemini AI</p>
        </div>

        {/* Feature List */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Smart Investment<br />Decisions, Instantly.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Our AI agent researches companies in real-time and delivers INVEST or PASS recommendations with full reasoning — powered by a multi-step LangGraph pipeline.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🔍", title: "Deep Company Research", desc: "4-stage AI analysis pipeline" },
              { icon: "📊", title: "Financial Analysis", desc: "Revenue, valuation & margins" },
              { icon: "⚠️", title: "Risk Assessment", desc: "Market, regulatory & execution risks" },
              { icon: "✅", title: "Clear Verdict", desc: "INVEST or PASS with confidence score" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer stat */}
        <div className="flex gap-8">
          {[["AI-Powered", "Research"], ["Real-Time", "Analysis"], ["Secure", "Platform"]].map(([a, b], i) => (
            <div key={i}>
              <p className="text-white font-bold text-lg">{a}</p>
              <p className="text-slate-400 text-xs">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-rose-300 font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(59,130,246,0.6)"; e.target.style.background = "rgba(59,130,246,0.06)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(59,130,246,0.6)"; e.target.style.background = "rgba(59,130,246,0.06)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              {loading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Signing in...</>
              ) : (
                <> Sign In <FaArrowRight className="text-sm" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-slate-500 text-sm">or continue with</span>
            <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
            />
          </div>

          {/* Register link */}
          <p className="text-center mt-8 text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
