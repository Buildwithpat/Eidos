"use client";

import PageTransition from "@/components/PageTransition";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 Add this line
import Antigravity from "@/components/signup/Antigravity";// Ensure the path is correct
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react"; // 👈 Add useEffect here



export default function SignUpPage() {

  const [name, setName] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    // 1. Save Name
    localStorage.setItem("eidos_user_name", name || "Explorer");
    localStorage.setItem("eidos_user_email", email || "user@eidos.app");
    // 2. Set Login Flag
    localStorage.setItem("isLoggedIn", "true");
    // 3. Redirect
    router.push("/dashboard");
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#050505] flex overflow-hidden">
        {/* LEFT SIDE: THE INTERACTIVE VISUAL */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#080808] border-r border-white/5 items-center justify-center overflow-hidden">
          {/* Antigravity Component as Background */}
          <div className="absolute inset-0 z-0">
            <Antigravity
              count={600}
              magnetRadius={8}
              ringRadius={6}
              waveSpeed={0.5}
              waveAmplitude={1.2}
              particleSize={1.2}
              lerpSpeed={0.06}
              color="#0052f5"
              autoAnimate
              particleVariance={1}
              particleShape="sphere"
              fieldStrength={15}
            />
          </div>

          {/* Floating Content over the Particles */}
          <div className="relative z-10 p-12 max-w-lg pointer-events-none">
            <div className="flex items-center gap-3 mb-10">
              <img src="/logo.svg" alt="Eidos" className="w-10 h-10" />
              <span className="text-white font-bold text-2xl tracking-tighter">
                Eidos
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Understand any <br />
              <span className="text-blue-500">websites</span> in seconds
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Discover fonts, colors, UI components, and structure behind modern
              websites.
            </p>
          </div>

          {/* Bottom Left Badge */}
          <div className="absolute bottom-10 left-12 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pointer-events-none">
            A <span className="text-blue-500/50">BWP</span> PRODUCT
          </div>
        </div>

        {/* RIGHT SIDE: THE SIGN UP FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                Let's set you up!
              </h2>
              <p className="text-white/40">
                Create your account to start analyzing.
              </p>
            </div>

            <form className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Name
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email} // 👈 Add this
                    onChange={(e) => setEmail(e.target.value)} // 👈 Add this
                    placeholder="Enter your email"
                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <p className="text-[11px] text-white/20 ml-1">
                  8 or more characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSignUp}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4"
              >
                Continue
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#050505] px-4 text-white/20 font-medium tracking-widest">
                    - or -
                  </span>
                </div>
              </div>

              <p className="text-white/40 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-500 font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
