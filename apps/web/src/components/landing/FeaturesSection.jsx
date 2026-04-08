// components/FeaturesSection.jsx
"use client";

import React from "react";
import { FiClock, FiSearch, FiCode } from "react-icons/fi";

const features = [
  {
    title: "Save Hours of Manual Inspection",
    desc: "Stop digging through browser dev tools to identify fonts, colors, and layouts. Eidos automatically reveals the design structure of any website in seconds.",
    icon: <FiClock className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Understand the Design Behind Any Website",
    desc: "Break down any interface into its building blocks. Discover fonts, color systems, layout patterns, and reusable UI components instantly.",
    icon: <FiSearch className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Export Clean, Reusable Code",
    desc: "Generate clean CSS or component-ready code and reuse design patterns in your own projects faster without rebuilding everything from scratch.",
    icon: <FiCode className="text-blue-500 w-6 h-6" />,
  },
];

export default function FeaturesSection() {
  return (
    // Structural Change: py-24 -> py-16 | max-w-5xl -> max-w-4xl (Tighter horizontal feel)
    <section className="py-16 px-6 max-w-4xl mx-auto">
      {/* Header Structural Change: mb-16 -> mb-10 */}
      <div className="text-center mb-10">
        <p className="text-white/40 text-[11px] font-medium tracking-[0.3em] uppercase mb-3">
          Built for modern workflows
        </p>
        {/* Structural Change: text-2xl -> text-xl */}
        <h3 className="text-xl text-white font-light italic opacity-80 leading-relaxed">
          "Stop digging through browser dev tools. <br />
          Eidos reveals the structure of any website instantly."
        </h3>
      </div>

      {/* Feature Cards: space-y-6 -> space-y-4 */}
      <div className="space-y-4">
        {features.map((f, i) => (
          <div
            key={i}
            // Structural Change: p-8 -> p-6 | rounded-32px -> rounded-24px
            className="group relative bg-[#0A0C10]/40 border border-white/5 p-6 rounded-[24px] hover:border-blue-500/30 transition-all duration-500"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-[24px] transition-opacity" />

            {/* gap-6 -> gap-5 */}
            <div className="relative flex gap-5 items-start">
              {/* p-3 -> p-2.5 */}
              <div className="shrink-0 p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                {f.icon}
              </div>
              <div>
                {/* text-xl -> text-lg */}
                <h4 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                  {f.title}
                </h4>
                {/* text-base -> text-sm */}
                <p className="text-white/40 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
