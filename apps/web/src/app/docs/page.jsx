// src/app/docs/page.jsx
"use client";

import PageTransition from "@/components/PageTransition";
import React, { useState } from "react";
import {
  FiZap,
  FiCpu,
  FiBox,
  FiCode,
  FiTerminal,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiCopy,
  FiSearch,
  FiLayout,
  FiChevronRight,
  FiDownload,
} from "react-icons/fi";

// --- REUSABLE SIDEBAR ITEM COMPONENT ---
const SidebarItem = ({ title, active, sectionId, icon, onClick }) => {
  const handleClick = () => {
    onClick(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all group ${
        active
          ? "bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]"
          : "text-white/30 hover:text-white/70 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`${active ? "text-blue-400" : "text-white/20 group-hover:text-white/40"}`}
        >
          {icon}
        </span>
        {title}
      </div>
      {active && <FiChevronRight className="text-blue-500/50" />}
    </button>
  );
};

// --- REUSABLE CALLOUT COMPONENT ---
const Callout = ({ type, title, children }) => {
  const themes = {
    info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    warning: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    danger: "border-red-500/20 bg-red-500/5 text-red-400",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  };

  // Fallback to info if type is not found
  const currentTheme = themes[type] || themes.info;

  return (
    <div className={`p-5 rounded-2xl border ${currentTheme} my-8 flex gap-4`}>
      <FiAlertCircle className="shrink-0 mt-1" />
      <div>
        {title && (
          <div className="font-bold mb-1 text-white/90 text-sm">{title}</div>
        )}
        <div className="text-sm leading-relaxed text-white/50">{children}</div>
      </div>
    </div>
  );
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
        <div className="max-w-[1440px] mx-auto flex">
          {/* --- FIXED SIDEBAR --- */}
          <aside className="hidden lg:block w-80 h-screen sticky top-0 border-r border-white/5 p-8 overflow-y-auto">
            {/* --- UPDATED SIDEBAR HEADER --- */}
            <div className="flex items-center gap-3 mb-12 px-2">
              <img
                src="/logo.svg"
                alt="Eidos Logo"
                className="w-8 h-8 object-contain"
              />

              <span className="font-bold tracking-tight text-lg uppercase text-white">
                Docs
              </span>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-10">
              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5 px-4">
                  Foundation
                </h4>
                <div className="space-y-1.5">
                  <SidebarItem
                    title="Introduction"
                    sectionId="introduction"
                    icon={<FiLayout />}
                    active={activeSection === "introduction"}
                    onClick={setActiveSection}
                  />
                  <SidebarItem
                    title="Quick Start"
                    sectionId="quickstart"
                    icon={<FiZap />}
                    active={activeSection === "quickstart"}
                    onClick={setActiveSection}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5 px-4">
                  Core Features
                </h4>
                <div className="space-y-1.5">
                  <SidebarItem
                    title="Element Inspector"
                    sectionId="inspector"
                    icon={<FiCpu />}
                    active={activeSection === "inspector"}
                    onClick={setActiveSection}
                  />
                  <SidebarItem
                    title="CSS Extraction"
                    sectionId="css"
                    icon={<FiCode />}
                    active={activeSection === "css"}
                    onClick={setActiveSection}
                  />
                  <SidebarItem
                    title="Asset Handoff"
                    sectionId="assets"
                    icon={<FiBox />}
                    active={activeSection === "assets"}
                    onClick={setActiveSection}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5 px-4">
                  Policy
                </h4>
                <div className="space-y-1.5">
                  <SidebarItem
                    title="Privacy & Security"
                    sectionId="security"
                    icon={<FiShield />}
                    active={activeSection === "security"}
                    onClick={setActiveSection}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN SCROLLABLE CONTENT --- */}
          <div className="flex-1 max-w-4xl px-8 md:px-20 py-24">
            {/* SECTION: INTRODUCTION */}
            <section id="introduction" className="mb-32 scroll-mt-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                v1.0.0-beta
              </div>
              <h1 className="text-5xl font-black text-white mb-8 tracking-tight">
                Introduction
              </h1>
              <p className="text-xl text-white/40 leading-relaxed font-light">
                Eidos is an architectural discovery engine that helps you bridge
                the gap between raw code and design systems. Instantly
                deconstruct any website into clean design tokens.
              </p>

              <Callout type="info" title="Beta Access Unlocked">
                During the Beta phase, all premium features including **Batch
                Export** and **SVG Optimization** are free for all early
                adopters.
              </Callout>
            </section>

            {/* SECTION: QUICK START */}
            <section id="quickstart" className="mb-32 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-mono">
                  01
                </span>
                Quick Start
              </h2>
              <p className="text-white/50 mb-10 leading-relaxed">
                Follow these three steps to integrate Eidos into your browser
                environment.
              </p>

              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    text: "Download the Beta package (.zip) from your dashboard.",
                  },
                  {
                    step: "02",
                    text: "Open chrome://extensions and toggle 'Developer Mode'.",
                  },
                  {
                    step: "03",
                    text: "Click 'Load Unpacked' and select the unzipped directory.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                  >
                    <div className="text-blue-500 font-black italic">
                      {item.step}
                    </div>
                    <div className="text-sm text-white/60">{item.text}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: ELEMENT INSPECTOR */}
            <section id="inspector" className="mb-32 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <FiCpu className="text-blue-500" /> Element Inspector
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Activate the Eidos panel and hover over any UI element. Eidos
                will instantly generate a{" "}
                <span className="text-white font-medium">
                  Computed Design Token
                </span>{" "}
                list representing that element's visual DNA.
              </p>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden mb-10">
                <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                  </div>
                  <FiCopy className="text-white/10 hover:text-blue-500 cursor-pointer transition-colors" />
                </div>
                <pre className="p-8 text-sm font-mono text-blue-400/80 leading-loose overflow-x-auto">
                  {`// Eidos Computed Styles
{
  "spacing": { "padding": "24px", "margin": "0 auto" },
  "typography": { "weight": "800", "size": "48px" },
  "visuals": { "blur": "20px", "opacity": "0.8" }
}`}
                </pre>
              </div>
            </section>

            {/* ✅ SECTION: CSS EXTRACTION ✅ */}
            <section id="css" className="mb-32 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <FiCode className="text-blue-500" /> CSS Extraction
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Eidos analyzes the raw CSS and converts it into modern
                frameworks like **Tailwind CSS**, **Styled Components**, or
                **SCSS Variables**. No more manual conversion of HEX to HSL or
                pixels to rem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <h4 className="text-white font-bold text-sm mb-2">
                    Tailwind Conversion
                  </h4>
                  <p className="text-xs text-white/30 leading-relaxed">
                    Auto-generates utility classes like{" "}
                    <code className="text-blue-400">bg-blue-600/10</code> from
                    raw RGBA values.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <h4 className="text-white font-bold text-sm mb-2">
                    Semantic Naming
                  </h4>
                  <p className="text-xs text-white/30 leading-relaxed">
                    Uses AI to suggest variable names based on the element's
                    function.
                  </p>
                </div>
              </div>
            </section>

            {/* ✅ SECTION: ASSET HANDOFF ✅ */}
            <section id="assets" className="mb-32 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <FiBox className="text-blue-500" /> Asset Handoff
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Export high-fidelity assets directly from the browser. Eidos
                handles the heavy lifting of optimizing SVGs and bundling font
                files into a single, production-ready package.
              </p>

              <Callout type="success" title="Performance Optimized">
                All SVG exports are automatically run through our optimization
                engine, reducing file size by up to **70%** without losing
                quality.
              </Callout>

              <div className="mt-10 p-1 border border-white/5 rounded-2xl bg-white/[0.02]">
                <div className="p-8 text-center">
                  <FiDownload className="mx-auto text-blue-500 w-8 h-8 mb-4 opacity-50" />
                  <p className="text-sm text-white/40 italic">
                    Select an element to view available asset exports
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION: SECURITY */}
            <section id="security" className="mb-32 scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-8">
                Privacy & Security
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Eidos operates entirely on your local machine. We do not store,
                track, or upload the data of the websites you analyze.
              </p>
              <Callout type="warning" title="Local Storage Only">
                All extracted tokens are saved in your browser's local storage.
                Clearing your cache will remove your history.
              </Callout>
            </section>

            {/* FOOTER */}
            <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                Updated April 2026 • Eidos Documentation
              </div>
              <div className="flex gap-8 text-[11px] text-white/40">
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  GitHub
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Support
                </a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
