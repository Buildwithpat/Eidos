"use client";
import React, { useMemo } from "react";
import { FiGlobe, FiZap, FiCheckCircle } from "react-icons/fi";

export default function Preview({ data }) {
  // ✅ 1. Check if data came from the Extension or the Backend
  // Extension data has a URL and elements but usually no 'screenshot' property yet
  const isExtensionSync = data && data.url && !data.screenshot;

  // Memoize screenshot URL for backend-captured data
  const screenshotUrl = useMemo(() => {
    if (!data?.screenshot) return null;
    return `http://localhost:5000/${data.screenshot}?t=${new Date().getTime()}`;
  }, [data?.id, data?.screenshot]);

  // ✅ 2. EMPTY STATE
  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#080A0F] p-12 text-center">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-6">
          <FiGlobe className="text-white/10 animate-pulse" size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-white/20 uppercase tracking-[0.3em] text-[11px] font-black">
            Waiting for Analysis
          </h3>
          <p className="text-white/10 text-[10px] max-w-[200px] leading-relaxed">
            Use the Eidos Extension or enter a URL above to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#080A0F] overflow-hidden flex flex-col">
      {/* Header Info Bar */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#05070B] shrink-0 z-20">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] ${isExtensionSync ? "bg-green-500" : "bg-blue-500"}`}
          />
          {isExtensionSync
            ? "Live Extension Sync"
            : `Inspection Canvas — ${data.title}`}
        </div>
        {isExtensionSync && (
          <div className="text-[9px] font-bold text-green-500/50 uppercase tracking-tighter flex items-center gap-1">
            <FiCheckCircle size={10} /> Connection Active
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto custom-scroll bg-[#0D0F14] flex flex-col items-center justify-center p-8">
        {isExtensionSync ? (
          /* ✅ EXTENSION VIEW: Shows a status card since we don't have a screenshot */
          <div className="max-w-sm w-full bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 bg-[#05070B] border border-blue-500/30 rounded-full flex items-center justify-center">
                <FiZap className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-white font-bold text-lg tracking-tight">
                Design System Captured
              </h2>
              <p className="text-white/40 text-xs leading-relaxed">
                Eidos has successfully pulled typography, colors, and components
                from: <br />
                <span className="text-blue-400 font-mono mt-2 block break-all">
                  {data.url}
                </span>
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-white/20 uppercase font-black mb-1">
                  Fonts
                </div>
                <div className="text-white font-bold text-xs">
                  {data.elements?.[0]?.fontFamily || "Detected"}
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-white/20 uppercase font-black mb-1">
                  Colors
                </div>
                <div className="text-white font-bold text-xs">
                  {data.colors?.length || 0} Found
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ✅ BACKEND VIEW: Shows the actual screenshot */
          <div className="relative h-fit w-fit shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5 rounded-lg overflow-hidden">
            <img
              src={screenshotUrl}
              alt="UI Screenshot"
              className="block h-auto"
              style={{ width: "1440px", minWidth: "1440px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
