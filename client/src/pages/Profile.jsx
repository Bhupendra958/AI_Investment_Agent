import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({ name: "", email: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.user);
      setStats(res.data.stats);
      setForm({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.log(err);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await api.put("/user/profile", form);

      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      loadProfile();
      alert("Profile Updated");
    } catch {
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  }

  async function updateAvatar(e) {
    e.preventDefault();

    if (!avatarFile) {
      alert("Please choose an image first");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();
      data.append("avatar", avatarFile);

      await api.post("/user/avatar", data);

      setAvatarFile(null);
      setAvatarPreview("");
      e.target.reset();
      await loadProfile();
      alert("Avatar Updated");
    } catch (err) {
      alert(err.response?.data?.message || "Avatar Update Failed");
    } finally {
      setUploading(false);
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview("");
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const apiBase =
    import.meta.env.VITE_API_URL?.replace("/api", "") || (import.meta.env.PROD ? "https://ai-investment-agent-9njw.onrender.com" : "http://localhost:5000");

  const avatarUrl =
    avatarPreview ||
    (profile.avatar
      ? `${apiBase}/uploads/${profile.avatar}`
      : profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 space-y-6">
        <Navbar title="Profile" />

        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {/* Avatar Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <img
              src={avatarUrl}
              alt={profile.name}
              className="w-40 h-40 rounded-full mx-auto object-cover ring-8 ring-blue-500/10 shadow-xl"
            />

            <h2 className="text-center text-2xl font-bold mt-5 text-slate-900 dark:text-white">
              {profile.name}
            </h2>

            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-1">{profile.email}</p>

            <span className="inline-flex mt-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
              {profile.role || "User"}
            </span>

            <p className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500">
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Edit Card */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Edit Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Update your name, email, and profile image.</p>

            <form onSubmit={updateProfile} className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-slate-200 dark:border-slate-700 p-3 rounded-xl w-full bg-slate-50/80 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-slate-200 dark:border-slate-700 p-3 rounded-xl w-full bg-slate-50/80 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />

              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <form onSubmit={updateAvatar} className="mt-8 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Profile Image</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload a new avatar to personalize your account.</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-blue-700 transition"
              />

              <button
                type="submit"
                disabled={uploading}
                className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {uploading ? "Uploading..." : "Upload Avatar"}
              </button>
            </form>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-5 mt-8">
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Research</h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {stats.totalResearch || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">INVEST</h3>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {stats.invest || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">PASS</h3>
            <p className="text-4xl font-bold text-rose-500 dark:text-rose-400 mt-2">
              {stats.pass || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Confidence</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.averageConfidence || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
