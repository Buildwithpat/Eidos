"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSend } from "react-icons/fi";

const EMOJIS = [
  { char: "😠", label: "Hate it", value: 1 },
  { char: "🙁", label: "Disappointed", value: 2 },
  { char: "😐", label: "Neutral", value: 3 },
  { char: "🙂", label: "Satisfied", value: 4 },
  { char: "🤩", label: "Love it!", value: 5 },
];

const CATEGORIES = [
  { id: "BUG", label: "Report Bug", icon: "🐛" },
  { id: "UIUX", label: "UI / UX", icon: "🎨" },
  { id: "FEATURE", label: "New Feature", icon: "✨" },
  { id: "OTHER", label: "Other", icon: "💬" },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(3);
  const [category, setCategory] = useState("FEATURE");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, category, ...formData }),
      });

      if (response.ok) {
        alert("Feedback received! Thank you for helping Eidos grow.");
        router.push("/");
      } else {
        alert("Something went wrong on the server.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm self-center"
      >
        <FiArrowLeft size={16} /> Back
      </button>

      {/* Main Feedback Card */}
      <div className="w-full max-w-xl bg-[#121214] border border-white/5 p-6 md:p-8 rounded-[28px] shadow-2xl relative">
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">
            We want your opinion
          </h1>
          <p className="text-white/40 text-xs tracking-wide">
            Help us build the ultimate analysis tool.
          </p>
        </div>

        {/* 1. Emoji Selection Section */}
        <div className="flex justify-between items-center mb-8 px-4">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji.value}
              type="button"
              onClick={() => setRating(emoji.value)}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className={`text-4xl transition-all duration-300 transform group-hover:scale-110 ${
                  rating === emoji.value
                    ? "scale-110 grayscale-0 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "grayscale opacity-25 hover:grayscale-0 hover:opacity-100"
                }`}
              >
                {emoji.char}
              </span>
              <span
                className={`text-[9px] uppercase tracking-tighter transition-opacity font-bold ${
                  rating === emoji.value
                    ? "opacity-100 text-blue-500"
                    : "opacity-0"
                }`}
              >
                {emoji.label}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 2. Category Selection Section */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-4 rounded-xl border text-[11px] flex items-center justify-center gap-2 transition-all font-medium ${
                    category === cat.id
                      ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Contact Info (Name & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/5"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-white/5"
              />
            </div>
          </div>

          {/* 4. Message Area */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">
              Feedback
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 h-28 text-sm focus:border-blue-500/50 outline-none resize-none transition-all placeholder:text-white/5"
              placeholder="What do you like or dislike about Eidos?"
            />
          </div>

          {/* 5. Submit Button */}
          <button
            disabled={loading}
            className="group w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10"
          >
            {loading ? "Sending..." : "Submit Feedback"}
            {!loading && (
              <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
