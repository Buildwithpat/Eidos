"use client";

import React from "react";

const BlockCard = ({ number, title, description }) => (
  <div className="relative group cursor-default">
    <div className="absolute -inset-px bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Structural Change: p-8 -> p-6 for a tighter look */}
    <div className="relative h-full bg-[#05070A] border border-white/5 rounded-2xl p-6 transition-all duration-300 group-hover:bg-[#080A0F] group-hover:border-white/10 group-hover:-translate-y-1">
      {/* Structural Change: mb-6 -> mb-4 */}
      <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-sm font-bold text-white mb-4 transition-transform duration-300 group-hover:scale-110">
        {number}
      </div>

      {/* Structural Change: mb-3 -> mb-2 */}
      <h3 className="text-white text-lg font-semibold mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-white/30 text-sm leading-relaxed font-normal">
        {description}
      </p>
    </div>
  </div>
);

export default function BuildingBlocks() {
  const blocks = [
    {
      number: 1,
      title: "Fonts Detection",
      description: "Identify all fonts used on a website instantly.",
    },
    {
      number: 2,
      title: "Color Palette",
      description: "Extract the complete color system used across the site.",
    },
    {
      number: 3,
      title: "UI Components",
      description:
        "Detect reusable components like buttons, cards and navbars.",
    },
    {
      number: 4,
      title: "Layout Structure",
      description: "Understand the layout hierarchy of each section.",
    },
    {
      number: 5,
      title: "Framework Detection",
      description: "Identify frameworks like Tailwind, Bootstrap or others.",
    },
    {
      number: 6,
      title: "Export Ready Code",
      description: "Export clean CSS or component code for your projects.",
    },
  ];

  return (
    // Structural Change: max-w-7xl -> max-w-6xl | pt-14 -> pt-10 | pb-32 -> pb-24
    <section className="relative z-20 pt-10 pb-24 px-6 max-w-6xl mx-auto">
      {/* Header Structural Change: mb-20 -> mb-14 */}
      <div className="text-center mb-14">
        {/* Structural Change: text-4xl md:text-5xl -> text-3xl md:text-4xl */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
          Discover the Building Blocks of <br />
          Any <span className="text-blue-500">Website</span>
        </h2>
        {/* Structural Change: mt-6 -> mt-4 */}
        <p className="mt-4 text-white/30 text-base font-normal max-w-xl mx-auto leading-relaxed">
          Eidos reveals the design tokens, layout structure, and components
          behind any website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <BlockCard key={block.number} {...block} />
        ))}
      </div>
    </section>
  );
}
