import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaChartLine, FaLock, FaEnvelope, FaArrowRight,
  FaUser, FaShieldAlt, FaCheckCircle
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
      icon: <FaUser className="text-xl" />,
      desc: "Access to research, history & your profile dashboard.",
      gradient: "from-blue-600 to-cyan-500",
      active: "rgba(59,130,246,0.15)",
      activeBorder: "rgba(59,130,246,0.5)",
    },
    {
      value: "admin",
      label: "Admin Account",
      icon: <FaShieldAlt className="text-xl" />,
      desc: "Full access including the admin analytics & user panel.",
      gradient: "from-amber-500 to-orange-500",
      active: "rgba(245,158,11,0.15)",
      activeBorder: "rgba(245,158,11,0.5)",
    },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
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

        {/* Info Blocks */}
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Join the Platform.<br />Research Smarter.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Create your free account to start analyzing companies with our multi-stage AI research pipeline. Get data-backed INVEST or PASS decisions in seconds.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "AI-powered 4-stage research pipeline",
              "Company overview, financials & risk analysis",
              "INVEST / PASS recommendation with reasoning",
              "Full research history saved to your profile",
              "Admin analytics for platform oversight",
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-8">
          {[["Secure", "JWT Auth"], ["Google", "OAuth"], ["Real-Time", "AI Analysis"]].map(([a, b], i) => (
            <div key={i}>
              <p className="text-white font-bold text-lg">{a}</p>
              <p className="text-slate-400 text-xs">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Get started with AI-powered investment research</p>
          </div>

          {/* Error / Success Banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-rose-300 font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-emerald-300 font-medium" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
              ✓ {success}
            </div>
          )}

          {/* Role Selection Cards */}
          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-medium mb-3">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const isSelected = form.role === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className="relative p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: isSelected ? opt.active : "rgba(255,255,255,0.04)",
                      border: `2px solid ${isSelected ? opt.activeBorder : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${opt.gradient} inline-flex mb-3`}>
                      {opt.icon}
                      <span className="sr-only">{opt.label}</span>
                    </div>
                    <p className="text-white font-bold text-sm mb-1">{opt.label}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{opt.desc}</p>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <FaCheckCircle className="text-emerald-400 text-sm" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(59,130,246,0.6)"; e.target.style.background = "rgba(59,130,246,0.06)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            </div>

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
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
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
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(59,130,246,0.6)"; e.target.style.background = "rgba(59,130,246,0.06)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
              style={{ background: form.role === "admin" ? "linear-gradient(135deg, #f59e0b, #f97316)" : "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              {loading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Creating account...</>
              ) : (
                <>Create {form.role === "admin" ? "Admin" : "User"} Account <FaArrowRight className="text-sm" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-slate-500 text-sm">or sign up with</span>
            <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign In Failed")}
            />
          </div>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
