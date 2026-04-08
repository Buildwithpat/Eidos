// components/PricingSection.jsx
"use client";

import React from "react";
import { FiCheck } from "react-icons/fi";

const tiers = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for students and hobbyists exploring web design.",
    features: [
      "3 Site Analyses / day",
      "Basic Element Capture",
      "CSS Property View",
      "Design System Overview",
    ],
    buttonText: "Current Plan",
    active: false,
  },
  {
    name: "Pro (Beta)",
    price: "8",
    desc: "For power users who need deep architectural insights.",
    features: [
      "Unlimited Analyses",
      "Batch Component Capture",
      "SVG & Asset Exports",
      "Full Project Handoff (ZIP)",
    ],
    buttonText: "Free in Beta",
    active: true,
  },
  {
    name: "Studio",
    price: "16",
    desc: "Custom solutions for large design agencies and teams.",
    features: [
      "Team Collaboration",
      "API Access",
      "Custom Branding",
      "Priority Support",
    ],
    buttonText: "Coming Soon",
    active: false,
  },
];

export default function PricingSection() {
  return (
    // Structural Change: py-32 -> py-20
    <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto">
      {/* Header Structural Change: mb-20 -> mb-12 */}
      <div className="text-center mb-12">
        {/* Structural Change: text-4xl md:text-5xl -> text-3xl md:text-4xl | mb-6 -> mb-4 */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Simple, Transparent <span className="text-blue-500">Pricing</span>
        </h2>

        {/* mb-6 -> mb-4 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            Beta Phase Active
          </span>
        </div>

        <p className="text-white/40 max-w-xl mx-auto text-sm italic leading-relaxed">
          "Note: All Pro features are currently unlocked for free during our
          Beta period. The pricing below will be implemented once we officially
          launch."
        </p>
      </div>

      {/* Grid: gap-8 -> gap-6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, i) => (
          <div
            key={i}
            // Structural Change: p-8 -> p-6 | rounded-[32px] -> rounded-[24px]
            className={`relative p-6 rounded-[24px] border transition-all duration-500 flex flex-col ${
              tier.active
                ? "bg-[#0A0C10] border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] scale-[1.02]"
                : "bg-[#05070A] border-white/5 opacity-80"
            }`}
          >
            {tier.active && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Recommended
              </span>
            )}

            {/* mb-8 -> mb-6 */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black text-white">
                  ${tier.price}
                </span>
                <span className="text-white/30 text-xs">/month</span>
              </div>
              <p className="text-white/40 text-[13px] leading-relaxed">
                {tier.desc}
              </p>
            </div>

            <button
              disabled
              // py-4 -> py-3 | mb-8 -> mb-6
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] mb-6 transition-all ${
                tier.active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/5 text-white/20 border border-white/5"
              }`}
            >
              {tier.buttonText}
            </button>

            {/* space-y-4 -> space-y-3 */}
            <ul className="space-y-3 flex-1">
              {tier.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-[13px] text-white/60"
                >
                  <FiCheck className="text-blue-500 shrink-0 w-4 h-4" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* mt-16 -> mt-12 */}
      <p className="text-center mt-12 text-white/20 text-[10px] font-medium tracking-wide">
        Free plan available • Cancel anytime • No credit card required during
        Beta
      </p>
    </section>
  );
}
