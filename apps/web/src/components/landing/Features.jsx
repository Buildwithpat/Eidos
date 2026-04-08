"use client";

import React from "react";
import { FiLink, FiSearch, FiCode } from "react-icons/fi";

const FeatureCard = ({ icon: Icon, title, description, children }) => (
  <div className="relative group">
    {/* Refined Glow: Lowered intensity */}
    <div className="absolute -inset-0.5 bg-blue-500/5 rounded-[24px] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

    <div className="relative bg-[#09090B] border border-white/5 rounded-[24px] p-1 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 text-white/70 text-[13px] font-medium">
        <Icon size={16} />
        <span>{title}</span>
      </div>

      {/* Internal Content Area: Reduced min-height from 300px to 240px */}
      <div className="bg-[#020408] rounded-[20px] flex-1 p-6 flex flex-col items-center justify-center min-h-[240px]">
        <p className="text-white/40 text-[14px] text-center mb-6 max-w-[200px]">
          {description}
        </p>
        <div className="w-full max-w-[260px]">{children}</div>
      </div>
    </div>
  </div>
);

export default function Features() {
  return (
    <section className="relative z-20 pt-10 pb-16 px-6 max-w-6xl mx-auto">
      {" "}
      {/* Shrunk max-w from 7xl to 6xl */}
      {/* Section Header: Tightened margins */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Analyze Any <span className="text-blue-500">Website</span> in Seconds
        </h2>
        <p className="mt-4 text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          Paste a website URL and instantly explore the design structure behind
          it.
        </p>
      </div>
      {/* Grid: Tighter gap for a more compact look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <FeatureCard
          icon={FiLink}
          title="Paste Website URL"
          description="Enter any public website URL you want to analyze with Eidos."
        >
          <div className="w-full space-y-3">
            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/30 text-sm">
              https://apple.com
            </div>
            <div className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 rounded-xl text-center text-sm font-medium">
              Analyze
            </div>
          </div>
        </FeatureCard>

        {/* Card 2 */}
        <FeatureCard
          icon={FiSearch}
          title="Analyze Design Structure"
          description="Eidos extracts fonts, colors, layout structure and UI components."
        >
          <div className="w-full grid grid-cols-2 gap-4 text-[12px]">
            <div className="space-y-1">
              <p className="text-white/80 font-medium">Fonts:</p>
              <p className="text-white/30">Font: Inter</p>
              <p className="text-white/30">Size: 13px</p>
              <p className="text-white/30">Weight: 400</p>
            </div>
            <div className="space-y-1 pt-5">
              <p className="text-white/30">Font: Inter</p>
              <p className="text-white/30">Size: 12px</p>
              <p className="text-white/30">Weight: 500</p>
            </div>
          </div>
        </FeatureCard>

        {/* Card 3 */}
        <FeatureCard
          icon={FiCode}
          title="Export Components"
          description="Get clean CSS or component code ready for your projects."
        >
          <div className="w-full bg-[#05070A] border border-white/5 rounded-xl p-3 font-mono text-[11px] leading-relaxed text-blue-400/80">
            <p className="text-white/20">.btn-primary &#123;</p>
            <p className="ml-4">background: #3B82F6;</p>
            <p className="ml-4">padding: 10px 16px;</p>
            <p className="text-white/20">&#125;</p>
          </div>
        </FeatureCard>
      </div>
    </section>
  );
}
