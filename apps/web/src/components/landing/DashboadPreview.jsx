"use client";

import React from "react";

export default function DashboardPreview() {
  return (
    <section className="relative z-20 py-20 px-6 w-full flex flex-col items-center">
      {/* 1. Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
          See What <span className="text-blue-500">Eidos</span> Can Discover
        </h2>
        <p className="mt-4 text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Analyze any website and instantly reveal its design structure,
          components, and code.
        </p>
      </div>

      {/* 2. Dashboard Preview Container */}
      <div className="relative w-full max-w-5xl group">
        {" "}
        {/* 🎯 Added max-w-5xl to make it fit the screen better */}
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-blue-500/10 rounded-[32px] blur-3xl opacity-60 group-hover:opacity-100 transition duration-1000" />
        {/* The Window Frame */}
        <div className="relative bg-[#05070A] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden shadow-black/90">
          {/* --- NEW macOS TOP BAR (image_2.png style) --- */}
          <div className="h-7 bg-[#121212] flex items-center justify-between px-4 border-b border-white/5">
            {/* Left: Traffic Lights + Finder Menu */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-3 text-[11px] font-medium text-white/70">
                <span className="text-[13px] text-white"></span>
                <span className="font-bold text-white">Finder</span>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Go</span>
              </div>
            </div>

            {/* Right: System Icons & Time */}
            <div className="flex items-center gap-3 text-[10px] text-white/50">
              <span>GH 49</span>
              <span>Lunch • 37m left</span>
              <span>📶</span>
              <span>🔋</span>
              <span className="text-white/80">Mon Jun 22 9:41 AM</span>
            </div>
          </div>

          {/* 3. The Content Area (Your Dashboard Screenshot Area) */}
          <div className="relative aspect-[1919/1079] bg-[#020408] overflow-hidden flex items-center justify-center">
            {/* 🎯 Use your 1919x1079 screenshot here */}
            <img
              src="/dashboard-preview.png" // Next.js automatically looks in the /public folder
              alt="Eidos Dashboard Preview"
              className="w-full h-full object-cover shadow-2xl"
            />

            {/* Optional Overlay to make it pop */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-b-[24px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
