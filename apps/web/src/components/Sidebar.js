"use client";

import React, { useState, useEffect } from "react";
import {
  FiBookmark,
  FiBox,
  FiShare,
  FiSettings,
  FiMessageSquare,
  FiSearch,
  FiFolder,
} from "react-icons/fi";
import Link from "next/link";
export default function Sidebar({
  activeView,
  setActiveView,
  recentAnalyses = [],
  setHistory,
  onNewAnalysis,
  fetchRecent,
  accentColor,
  analysisCount, 
  userPlan,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="w-[240px] border-r border-white/5 bg-[#05070B] h-full shrink-0" />
    );
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents clicking the "X" from opening the analysis
    if (!confirm("Delete this analysis?")) return;

    try {
      const res = await fetch(`/api/analyses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Refresh the list after deleting
        window.location.reload();
        // Note: In a real app, you'd call a refresh function passed via props instead of reloading
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

 const NavItem = ({ icon: Icon, label, active, onClick }) => (
   <div
     onClick={onClick}
     style={
       active
         ? {
             backgroundColor: `${accentColor}1A`, // 10% opacity theme
             borderColor: `${accentColor}33`, // 20% opacity border
             color: accentColor,
           }
         : {}
     }
     className={`px-3 py-2 rounded-lg cursor-pointer transition-all group border ${
       active ? "" : "hover:bg-white/[0.02] border-transparent"
     }`}
   >
     <div className="flex items-center gap-3">
       <Icon
         className={`text-sm ${
           active ? "" : "text-white/30 group-hover:text-white/60"
         }`}
         style={active ? { color: accentColor } : {}}
       />
       <span
         className={`text-[13px] ${
           active
             ? "text-white font-bold"
             : "text-white/50 group-hover:text-white/80"
         }`}
       >
         {label}
       </span>
     </div>
   </div>
 );

  return (
    <aside className="w-[240px] border-r border-white/5 flex flex-col p-4 shrink-0 bg-[#05070B] h-full">
      {/* 1. LOGO SECTION - RESTORED */}
      <div className="flex items-center gap-[10px] px-2 mb-8">
        <img src="/logo.svg" alt="Eidos Logo" className="w-[24px] h-auto" />
        <span className="text-[16px] font-semibold text-white tracking-tighter">
          Eidos
        </span>
      </div>

      {/* 2. ACTION BUTTON */}
      <button
        onClick={onNewAnalysis}
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}4D`,
        }}
        className="w-full text-white py-2.5 rounded-md text-[13px] font-bold mb-8 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
      >
        New Analysis
      </button>

      {/* 3. SCROLLABLE NAVIGATION */}
      <div className="flex-1 space-y-8 overflow-y-auto custom-scroll pr-1">
        {/* RECENT SECTION */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-4 opacity-40">
            <FiSearch className="text-[10px]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Recent
            </span>
          </div>

          {/* 🕒 RECENT SECTION */}
          <div className="space-y-1">
            {recentAnalyses && recentAnalyses.length > 0 ? (
              recentAnalyses
                .filter((item) => item.domain && item.domain !== "unknown.com")
                .map((item, index) => (
                  /* Use index with ID to ensure uniqueness */
                  <div key={`${item.id}-${index}`} className="group relative">
                    {/* Main Analysis Button */}
                    <button
                      onClick={() => {
                        if (item.data) {
                          setHistory(item.data);
                        }
                        setActiveView("audit");
                      }}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all border border-transparent text-left pr-8 group/item
              ${
                activeView === "audit" && history === item.data
                  ? "bg-white/[0.05] border-white/5 shadow-sm"
                  : "hover:bg-white/[0.03] active:scale-[0.98]"
              }`}
                    >
                      <div
                        /* ✅ ADD DYNAMIC BACKGROUND AND BORDER */
                        style={{
                          backgroundColor: `${accentColor}1A`, // 10% Opacity
                          borderColor: `${accentColor}33`, // 20% Opacity
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors shrink-0"
                      >
                        <FiFolder
                          style={{ color: accentColor }}
                          className="text-[10px]"
                        />
                      </div>

                      <div className="overflow-hidden">
                        <p
                          className="text-white text-[12px] font-bold truncate transition-all"
                          style={{
                            // This keeps it the accent color if it's the one currently being viewed
                            color:
                              activeView === "audit" && history === item.data
                                ? accentColor
                                : "white",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = accentColor)
                          }
                          onMouseLeave={(e) => {
                            // Logic: If it's active, leave it colored; if not, go back to white
                            const isActive =
                              activeView === "audit" && history === item.data;
                            e.currentTarget.style.color = isActive
                              ? accentColor
                              : "white";
                          }}
                        >
                          {item.domain || "Unknown Domain"}
                        </p>
                        <p className="text-white/20 text-[9px] font-medium tracking-tight uppercase">
                          {new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </button>

                    {/* ❌ THE SMALL CROSS BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetch(`/api/analyses?id=${item.id}`, {
                          method: "DELETE",
                        })
                          .then((res) => {
                            if (res.ok) {
                              fetchRecent();
                            }
                          })
                          .catch((err) => console.error("Delete failed:", err));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-md transition-all z-10 active:scale-90"
                      title="Delete analysis"
                    >
                      <span className="text-white/20 hover:text-red-500 text-[18px] leading-none font-medium transition-colors">
                        ×
                      </span>
                    </button>
                  </div>
                ))
            ) : (
              <div className="px-3 py-2 text-white/20 text-[11px] italic">
                No recent analyses
              </div>
            )}
          </div>
        </div>

        {/* LIBRARY SECTION */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black mb-4 px-2">
            Library
          </h3>
          <div className="space-y-1">
            <NavItem
              icon={FiBookmark}
              label="Saved"
              active={activeView === "saved"}
              onClick={() => setActiveView("saved")}
            />
            <NavItem
              icon={FiBox}
              label="Assets"
              active={activeView === "assets"}
              onClick={() => setActiveView("assets")}
            />
            <NavItem
              icon={FiShare}
              label="Exports"
              active={activeView === "exports"}
              onClick={() => setActiveView("exports")}
            />
          </div>
        </div>
      </div>

      {/* 4. FOOTER / PLAN SECTION */}
      <div className="mt-auto pb-12 space-y-6">
        {/* ✅ MATCHED WIDTH CREDITS BOX */}
        <div className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              Credits
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              Unlimited
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-700 ease-in-out"
              style={{
                width: `100%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}4D`,
              }}
            />
          </div>

          <button
            onClick={() => setActiveView("upgrade")}
            style={{
              borderColor: `${accentColor}4D`,
              color: accentColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}1A`;
              e.currentTarget.style.borderColor = `${accentColor}99`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0A1020";
              e.currentTarget.style.borderColor = `${accentColor}4D`;
            }}
            className="w-full py-2 bg-[#0A1020] border text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all duration-300 active:scale-95 cursor-pointer mt-1"
          >
            Upgrade
          </button>
        </div>

        {/* ✅ PERFECTLY ALIGNED NAVIGATION SECTION */}
        <div className="space-y-1">
          {/* Settings Button */}
          <button
            onClick={() => setActiveView("settings")}
            style={
              activeView === "settings"
                ? {
                    backgroundColor: `${accentColor}1A`,
                    color: accentColor,
                    borderColor: `${accentColor}33`,
                  }
                : {}
            }
            className={`w-full flex items-center justify-start gap-4 px-2 py-2 text-[12px] font-medium cursor-pointer transition-all rounded-lg border border-transparent ${
              activeView !== "settings"
                ? "text-white/40 hover:text-white hover:bg-white/5"
                : ""
            }`}
          >
            <div className="w-5 flex justify-center shrink-0">
              <FiSettings size={14} />
            </div>
            <span className="text-left">Settings</span>
          </button>

          {/* Feedback Button */}
          <Link href="/feedback" className="block no-underline">
            <div className="flex items-center justify-start gap-4 px-2 py-2 text-white/40 hover:text-white text-[12px] font-medium cursor-pointer transition-colors rounded-lg hover:bg-white/5 border border-transparent">
              <div className="w-5 flex justify-center shrink-0">
                <FiMessageSquare size={14} />
              </div>
              <span className="text-left">Feedback</span>
            </div>
          </Link>

          {/* 🚀 BETA VERSION TAG */}
          <div className="pt-8 text-center w-full">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/15 select-none block w-full">
              Beta Version
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
