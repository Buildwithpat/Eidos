// components/Footer.jsx
"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] pt-12 pb-8 px-6 overflow-hidden">
      {/* 🔵 The Radial Glow from your screenshot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Left Section: Logo & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.svg"
                alt="Eidos"
                className="w-10 h-10 object-contain"
              />
              <span className="text-white text-3xl font-medium tracking-tight">
                Eidos
              </span>
            </div>
            <h3 className="text-white text-xl font-medium mb-4 leading-tight max-w-sm">
              Understand the design structure behind any website.
            </h3>
            <p className="text-white/40 text-[15px] leading-relaxed max-w-md mb-12">
              Eidos analyzes modern websites and reveals the fonts, color
              systems, UI components, and layout patterns that power them.
            </p>
            <p className="text-white/30 text-sm italic">
              Built by a developer passionate about design systems.
            </p>
          </div>

          {/* Middle Section: Products */}
          <div className="md:col-start-7 md:col-span-2">
            <h4 className="text-white font-medium text-base mb-8">Products</h4>
            <ul className="space-y-4">
              {["Examples", "Pricing", "Docs"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/40 hover:text-white transition-colors text-base font-normal"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section: Legal & BWP Logo */}
          <div className="md:col-span-4 flex flex-col justify-between items-end">
            <div className="w-full text-right md:text-left md:pl-20">
              <h4 className="text-white font-medium text-base mb-8">Legal</h4>
              <ul className="space-y-4">
                {["Privacy", "Terms", "Github"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-400 transition-colors text-base font-normal"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ YOUR #BWP LOGO SITTING ON THE RIGHT */}
            <div className="mt-auto">
              <img
                src="/bwp-logo.svg"
                alt="BWP"
                className="h-12 w-auto opacity-90"
              />
            </div>
          </div>
        </div>

        {/* The Thin Horizontal Line */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom Copyright */}
        <div className="text-center">
          <p className="text-white/40 text-sm font-light">
            © 2026 Eidos. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
