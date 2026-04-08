"use client";

import React, { useState, useEffect } from "react";
import { FiGlobe, FiDownload, FiBell } from "react-icons/fi";

export default function Topbar({
  onAnalyze,
  isLoading,
  onExport,
  accentColor,
  setActiveView,
}) {
  const [url, setUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  // const [avatar, setAvatar] = useState("✌️");

  // --- ADDED FOR DYNAMIC AVATAR ---
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();

    // 👂 Listen for the "user-updated" event from SettingsComponent
    window.addEventListener("user-updated", fetchUser);

    // 🧹 Cleanup the listener when the component is destroyed
    return () => {
      window.removeEventListener("user-updated", fetchUser);
    };
  }, []);

  if (!mounted) {
    return (
      <header className="h-14 border-b border-white/5 bg-[#05070B] w-full" />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!url.trim() || isLoading) return;

    let finalUrl = url.trim();
    // Basic auto-format for URLs
    if (!finalUrl.startsWith("http")) {
      finalUrl = "https://" + finalUrl;
    }

    window.open(finalUrl, "_blank");

    // This calls the handleAnalyze function in your page.js
    onAnalyze(finalUrl);
  };

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#05070B] z-50 shrink-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 flex-1 max-w-2xl"
      >
        <div className="flex items-center flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1 gap-3 focus-within:border-blue-500/50 transition-all shadow-inner">
          <FiGlobe className="text-white/30 text-sm" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent text-[13px] text-white/80 focus:outline-none flex-1 py-1 placeholder:text-white/10"
            placeholder="Enter website URL (e.g. vercel.com)"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            borderColor: `${accentColor}4D`,
            backgroundColor: `${accentColor}1A`,
            color: accentColor,
          }}
          className="bg-[#0A1020] text-blue-400 px-5 py-2 rounded-lg text-[13px] font-bold border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wider active:scale-95"
        >
          {isLoading ? "..." : "Analyze"}
        </button>
      </form>

      <div className="flex items-center gap-4">
        {/* 🚀 BWP BRAND LOGO WITH GLOW */}
        <div className="flex items-center pr-4 border-r border-white/10 mr-2 group">
          <div className="flex items-center">
            <img
              src="/bwp-logo.svg"
              alt="BWP"
              className="h-[28px] w-auto opacity-60 group-hover:opacity-100 transition-opacity cursor-default select-none"
            />
          </div>
        </div>

        {/* EXPORT ALL BUTTON */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-[#1A110A] text-orange-500 px-4 py-2 rounded-lg text-[13px] font-semibold border border-orange-500/20 hover:bg-orange-500/10 transition-all text-nowrap active:scale-95 cursor-pointer"
        >
          <FiDownload className="text-sm" />
          Export All
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        <div className="relative cursor-pointer group">
          <FiBell className="text-white/40 group-hover:text-white transition-colors" />
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-[#05070B]"
          />
        </div>

        {/* --- UPDATED DYNAMIC AVATAR BUTTON --- */}
        <button
          onClick={() => setActiveView("settings")}
          className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-gradient-to-tr from-gray-800 to-gray-950 shrink-0 hover:border-white/30 transition-all cursor-pointer outline-none focus:ring-2 flex items-center justify-center"
          style={{ focusVisibleRingColor: accentColor }}
        >
          {user?.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[10px] font-bold text-white/40 uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
