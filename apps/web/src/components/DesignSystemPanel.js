"use client";
import React from "react";
import { FiLayers, FiLock, FiFolder } from "react-icons/fi";
import AssetItem from "./AssetItem";

export default function DesignSystemPanel({ history, assets, accentColor }) {
  console.log("Current Theme Color:", accentColor);
  const colors = [
    ...new Set(
      history
        .flatMap((el) => [
          el.color,
          el.backgroundColor !== "#000000" &&
          el.backgroundColor !== "transparent"
            ? el.backgroundColor
            : null,
        ])
        .filter((c) => c && c !== "transparent" && c !== "rgba(0,0,0,0)"),
    ),
  ];

  const fonts = [
    ...new Set(history.map((el) => el.fontFamily).filter(Boolean)),
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* 1. DESIGN SYSTEM */}
      <section>
        <h3
          className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 "
          style={{ color: accentColor }}
        >
          <FiLayers /> Design System
        </h3>
        <div className="space-y-10">
          <div>
            <p className="text-white/60 text-[10px] font-black uppercase mb-5 tracking-widest">
              Colors Detected
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.length > 0 ? (
                colors.map((c) => (
                  <div
                    key={c}
                    className="w-10 h-10 rounded-xl border border-white/10 shadow-xl"
                    style={{ backgroundColor: c }}
                  />
                ))
              ) : (
                <p className="text-white font-bold text-[11px] italic">
                  No colors yet
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASSETS SECTION */}
      <section className="space-y-8">
        <h3
          className="text-blue-500 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <FiFolder /> Assets
        </h3>
        <div className="space-y-8">
          {["logos", "icons", "backgrounds"].map((category) => (
            <div key={category}>
              <p className="text-white/90 text-[10px] font-black uppercase mb-4 tracking-[0.2em] flex justify-between items-center">
                <span className="capitalize">{category}</span>
                {/* ✅ Updated: Asset Count Color */}
                <span style={{ color: accentColor }} className="opacity-80">
                  ({assets[category]?.length || 0})
                </span>
              </p>
              <div className="space-y-2">
                {assets[category]?.length > 0 ? (
                  assets[category].map((a, i) => (
                    <AssetItem key={i} asset={a} />
                  ))
                ) : (
                  <div
                    style={{
                      borderColor: `${accentColor}33`,
                      backgroundColor: `${accentColor}05`,
                    }}
                    className="text-[10px] text-white/40 font-bold py-6 border border-dashed rounded-xl text-center uppercase tracking-widest"
                  >
                    No {category} captured yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BLURRED CARD */}
      <div className="relative p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent overflow-hidden mt-4">
        <div className="absolute inset-0 backdrop-blur-[12px] bg-black/60 z-10 flex flex-col items-center justify-center border border-white/10 rounded-3xl">
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">
            <FiLock /> Coming Soon
          </div>
        </div>
        <div className="relative z-0 opacity-20">
          <h4 className="text-white font-bold text-sm">Eido AI</h4>
          <p className="text-[10px] text-white/40">
            Generate production-ready React components.
          </p>
        </div>
      </div>
    </div>
  );
}
