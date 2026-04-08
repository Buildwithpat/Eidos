"use client";
import { useState, useEffect } from "react";
import { FiUser, FiClock, FiTrash2, FiExternalLink } from "react-icons/fi";

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    const res = await fetch("/api/admin/feedback");
    const data = await res.json();
    setFeedbacks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
    if (res.ok) {
      // Refresh the list locally so the deleted item disappears instantly
      setFeedbacks(feedbacks.filter((f) => f.id !== id));
    }
  };

  const getEmoji = (rating) => {
    const map = { 1: "😠", 2: "🙁", 3: "😐", 4: "🙂", 5: "🤩" };
    return map[rating] || "❓";
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white/50">
        Loading Admin Portal...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Feedback Inbox</h1>
          <div className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 text-white/40">
            {feedbacks.length} Messages
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="group bg-[#121214] border border-white/5 p-5 rounded-2xl hover:border-blue-500/30 transition-all"
            >
              <div className="flex gap-6">
                {/* Left: Emoji & Rating */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                    {getEmoji(f.rating)}
                  </div>
                  <span className="text-[10px] font-bold text-blue-500">
                    {f.category}
                  </span>
                </div>

                {/* Middle: Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-sm">
                      {f.name || "User"}
                    </span>
                    <span className="text-white/10 text-xs">|</span>
                    <span className="text-white/30 text-xs flex items-center gap-1">
                      <FiClock size={12} />{" "}
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {f.message}
                  </p>
                  <div className="text-[11px] text-white/20 hover:text-white/40 transition-colors">
                    Contact: {f.email || f.user?.email || "No email provided"}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <a
                    href={`mailto:${f.email || f.user?.email}`}
                    className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-blue-600 hover:text-white transition-all"
                    title="Reply"
                  >
                    <FiExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
