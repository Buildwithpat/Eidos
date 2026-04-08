import React from "react";
import {
  FiCheck,
  FiX,
  FiZap,
  FiTarget,
  FiLayers,
  FiLock,
} from "react-icons/fi";

const UpgradeView = ({ accentColor, userPlan, setUserPlan, setActiveView }) => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "For casual exploration.",
      features: [
        { text: "3 site analyses per day", included: true },
        { text: "Basic CSS code only", included: true },
        { text: "3 extractions per day", included: true },
        { text: "Tailwind Code", included: false },
        { text: "Save project history", included: false },
        { text: "Custom Themes", included: false },
      ],
      buttonText: userPlan === "free" ? "Current Plan" : "Downgrade",
      popular: false,
    },
    {
      name: "Pro",
      price: "8",
      description: "For designers & developers.",
      features: [
        { text: "Unlimited analyses", included: true },
        { text: "Tailwind + CSS Export", included: true },
        { text: "Unlimited extractions", included: true },
        { text: "Save project history", included: true },
        { text: "All Syntax Themes", included: true },
        { text: "Asset Downloads", included: true },
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Studio",
      price: "16",
      description: "For agencies & power users.",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Batch Asset ZIP Export", included: true },
        { text: "Design Token JSON Export", included: true },
        { text: "AI Component Generator", included: true },
        { text: "Cloud Sync (Soon)", included: true },
        { text: "Team Sharing (Soon)", included: true },
      ],
      buttonText: "Upgrade to Studio",
      popular: false,
    },
  ];

  return (
    <div className="flex-1 bg-[#05070B] overflow-y-auto custom-scroll p-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-3">
            Upgrade Your Plan
          </h1>
          <p className="text-white/40 text-sm font-medium max-w-xl leading-relaxed">
            Unlock unlimited site extractions, Tailwind CSS output, and full
            project history.
          </p>
        </div>
        <button
          onClick={() => setActiveView("audit")}
          style={{ color: accentColor, borderColor: `${accentColor}33` }}
          className="px-6 py-2 bg-white/5 border rounded-xl text-[14px] font-semibold uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={
              plan.popular
                ? {
                    borderColor: `${accentColor}4D`,
                    boxShadow: `0 0 40px ${accentColor}10`,
                  }
                : {}
            }
            className={`relative p-8 rounded-[32px] border ${plan.popular ? "bg-white/[0.03]" : "bg-[#0A0C10] border-white/5"} flex flex-col`}
          >
            {plan.popular && (
              <div
                style={{ backgroundColor: accentColor }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
              >
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-white font-black text-xl mb-1 uppercase tracking-wider">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  ${plan.price}
                </span>
                <span className="text-white/20 text-xs font-bold">/ month</span>
              </div>
              <p className="text-white/40 text-[11px] mt-2 font-medium italic">
                {plan.description}
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  {feat.included ? (
                    <FiCheck
                      style={{ color: plan.popular ? accentColor : "#10b981" }}
                      className="shrink-0 w-4 h-4"
                    />
                  ) : (
                    <FiX className="text-white/10 shrink-0 w-4 h-4" />
                  )}
                  <span
                    className={`text-[12px] ${feat.included ? "text-white/70" : "text-white/20 font-medium"}`}
                  >
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                plan.name !== "Free" && setUserPlan(plan.name.toLowerCase())
              }
              style={
                plan.popular
                  ? { backgroundColor: accentColor }
                  : { backgroundColor: "rgba(255,255,255,0.05)" }
              }
              className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 cursor-pointer ${
                plan.popular
                  ? "text-white shadow-xl hover:brightness-110"
                  : "text-white/60 hover:bg-white/10"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER STATS */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div
            style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl border border-white/5"
          >
            <FiTarget />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Daily Usage</h4>
            <p className="text-white/30 text-xs">
              You have used <span className="text-white">3 / 3</span> free
              analyses today.
            </p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">
            Next Reset In
          </p>
          <p className="text-white font-mono text-xl">14:22:09</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;
