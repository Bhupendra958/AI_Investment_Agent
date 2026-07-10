import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaChartLine,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", form);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed. Please try again.");
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
      console.log(err);
      setError("Google Sign In Failed. Please try again.");
    }
  };

  const roleOptions = [
    {
      value: "user",
      label: "User Account",
      icon: <FaUser className="text-lg" />,
      desc: "Access to research, history & your profile dashboard.",
      gradient: "from-blue-600 to-cyan-500",
      activeBg: "rgba(59, 130, 246, 0.08)",
      activeBorder: "rgba(59, 130, 246, 0.4)",
    },
    {
      value: "admin",
      label: "Admin Account",
      icon: <FaShieldAlt className="text-lg" />,
      desc: "Full access including the admin analytics & user panel.",
      gradient: "from-amber-500 to-orange-500",
      activeBg: "rgba(245, 158, 11, 0.08)",
      activeBorder: "rgba(245, 158, 11, 0.4)",
    },
  ];

  return (
    <div className="min-h-screen flex text-slate-100 relative overflow-hidden" style={{ background: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)" }}>
      {/* Decorative Shifting Glowing Blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full filter blur-[100px] opacity-25"
        style={{ background: "radial-gradient(circle, #3b82f6, #06b6d4)" }}
        animate={{
          x: [0, 45, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full filter blur-[120px] opacity-20"
        style={{ background: "radial-gradient(circle, #10b981, #3b82f6)" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/25 relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
            <FaChartLine className="text-white text-xl relative z-10" />
          </div>
          <div>
            <span className="text-white text-2xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              AI Investment
            </span>
            <p className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-0.5">
              Powered by LangGraph + Gemini AI
            </p>
          </div>
        </motion.div>

        {/* Feature List */}
        <div className="space-y-10 my-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Research Smarter.<br />Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Platform</span> today.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
              Set up your profile to start evaluating companies using multi-stage AI agent reasoning graphs. Complete history and watchlists at your fingertips.
            </p>
          </motion.div>

          <div className="space-y-3 max-w-lg">
            {[
              "AI-powered 4-stage research pipeline",
              "Dynamic financial metric and valuation checks",
              "Deep adversarial threat assessment and opportunity scoring",
              "Automatic analysis history log saved directly to your profile",
              "Admin suite containing user metrics and analytics logs",
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3.5 py-1"
              >
                <FaCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
                <span className="text-slate-300 text-sm font-medium">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-12 border-t border-white/5 pt-8"
        >
          {[["Secure", "JWT Authentication"], ["Google", "OAuth Integrations"], ["Real-time", "Analytical Runs"]].map(([a, b], i) => (
            <div key={i}>
              <p className="text-white font-bold text-lg">{a}</p>
              <p className="text-slate-400 text-xs mt-0.5">{b}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/[0.02] border border-white/10 backdrop-blur-2xl p-8 lg:p-10 rounded-3xl shadow-2xl relative my-8"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-xs opacity-70" />

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-400 text-sm">Join the AI-powered investment platform</p>
          </div>

          {/* Error / Success Banners */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-xs text-rose-300 font-semibold border border-rose-500/20 bg-rose-500/10 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse flex-shrink-0" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-xs text-emerald-300 font-semibold border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              {success}
            </motion.div>
          )}

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-semibold mb-3">Account Type</label>
            <div className="grid grid-cols-2 gap-3.5">
              {roleOptions.map((opt) => {
                const isSelected = form.role === opt.value;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className="relative p-4.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    style={{
                      background: isSelected ? opt.activeBg : "rgba(255,255,255,0.02)",
                      border: `1.5px solid ${isSelected ? opt.activeBorder : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${opt.gradient} shadow-lg inline-flex mb-3 relative`}>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-tr ${opt.gradient} blur-xs opacity-40`} />
                      <span className="relative z-10 text-white">{opt.icon}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-1">{opt.label}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{opt.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5">
                        <FaCheckCircle className="text-emerald-400 text-sm" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-semibold">Full Name</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-semibold">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-semibold">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-75 disabled:hover:scale-100 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer mt-2"
              style={{
                background:
                  form.role === "admin"
                    ? "linear-gradient(135deg, #d97706, #ea580c)"
                    : "linear-gradient(135deg, #2563eb, #0891b2)",
              }}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-white/20 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">or sign up with</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center bg-white/[0.02] border border-white/5 py-3 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign In Failed")}
            />
          </div>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
