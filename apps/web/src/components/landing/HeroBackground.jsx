"use client";

import React from "react";
import Lottie from "lottie-react";

export default function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020408] overflow-hidden select-none pointer-events-none">
      {/* 1. THE LOTTIE ANIMATION */}
      <div className="absolute inset-0 flex items-center justify-center scale-110">
        <Lottie
          // Use the path string directly. Next.js knows to look in /public
          path="/animations/hero-bg.json"
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 2. SUBTLE FADE */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(2, 4, 8, 0.4) 0%, #020408 90%)`,
        }}
      />
    </div>
  );
}
