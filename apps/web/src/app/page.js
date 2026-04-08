"use client";

import PageTransition from "@/components/PageTransition";

import React, { useState } from "react";
import { FiSearch, FiLink } from "react-icons/fi"; // Added Link icon for your design
import Navbar from "@/components/landing/Navbar";
import { useRouter } from "next/navigation";
import Features from "@/components/landing/Features";
import HeroBackground from "@/components/landing/HeroBackground";
import DashboardPreview from "@/components/landing/DashboadPreview";
import ExtensionPromo from "@/components/landing/ExtensionPromo";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";

import BuildingBlocks from "@/components/landing/BuildingBlocks";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const router = useRouter(); // Initialize the router

  const handleAnalyze = (e) => {
    if (e) e.preventDefault();
    if (!url) return;

    // Check authentication status
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      // User is logged in -> Go to Dashboard
      router.push(`/dashboard?url=${encodeURIComponent(url)}`);
    } else {
      // User is NOT logged in -> Save URL and go to Login
      sessionStorage.setItem("pendingUrl", url);
      router.push("/login");
    }
  };

  return (
    <main className="relative min-h-screen text-white">
      {/* FIXED BACKGROUND */}
      <HeroBackground />

      {/* NAVBAR */}
      <Navbar />

      {/* 2. HERO CONTENT (Accurate Typography and Spacing) */}
      <section className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] max-w-3xl">
          Understand the Design Behind Any Website
        </h1>

        {/* Subtext */}
        <p className="mt-8 text-white/50 text-base md:text-lg max-w-xl font-normal leading-relaxed">
          Paste a website URL to instantly explore its fonts, colors, and UI
          components.
        </p>

        {/* 3. SEARCH BAR */}
        <div className="mt-16 w-full max-w-3xl relative px-4">
          <div className="absolute -inset-2 bg-blue-500/10 blur-3xl rounded-full opacity-50" />

          <div className="relative flex items-center bg-white/[0.08] border border-white/[0.12] backdrop-blur-md rounded-[28px] p-2.5 pl-6 shadow-2xl">
            <div className="text-white/40">
              <FiLink size={20} strokeWidth={1.5} />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} // Trigger on Enter key
              placeholder="Paste a website URL..."
              className="w-full bg-transparent border-none outline-none text-white text-[15px] font-normal placeholder:text-white/30 ml-3"
            />

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze} // Trigger the function
              className="bg-white/[0.12] border border-white/10 text-white/90 px-8 py-3 rounded-[20px] text-[15px] font-medium hover:bg-white/[0.18] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Footer Support Text */}
        <p className="mt-8 text-sm text-white/30 font-normal tracking-wide">
          Analyze up to 3 websites per day for free
        </p>
      </section>

      <ExtensionPromo />
      <section id="features">
        <Features />
      </section>
      <BuildingBlocks />
      <DashboardPreview />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
