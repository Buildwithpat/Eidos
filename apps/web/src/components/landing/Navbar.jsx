"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // 🎯 Smooth Scroll Logic
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();

    if (pathname !== "/") {
      // Agar landing page par nahi ho, toh home par jao with hash
      router.push(`/#${sectionId}`);
    } else {
      // Agar landing page par hi ho, toh smooth scroll karo
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Navbar ki height ke liye offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 md:p-6">
      <div className="w-full max-w-7xl flex items-center justify-between px-8 py-3 bg-white/[0.03] border border-white/5 backdrop-blur-lg rounded-2xl shadow-lg shadow-black/30">
        {/* --- LOGO & LINKS --- */}
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Eidos Logo" width={28} height={28} />
            <span className="text-lg font-medium text-white tracking-tight">
              Eidos
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-normal">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </a>

            {/* ✅ Open Docs in NEW WINDOW */}
            <Link
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              Docs
            </Link>

            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </a>
          </div>
        </div>

        {/* --- CTA ACTIONS --- */}
        <div className="flex items-center gap-6">
          <Image
            src="/bwp-logo.svg"
            alt="BWP Logo"
            width={80}
            height={80}
            className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          />

          <Link
            href="/login"
            className="px-6 py-2 bg-transparent border border-white/10 rounded-xl text-sm font-normal text-white/70 hover:border-white/30 hover:text-white transition-all active:scale-95"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition-all active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
