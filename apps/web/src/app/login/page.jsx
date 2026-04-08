"use client";

import PageTransition from "@/components/PageTransition";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Antigravity from "@/components/signup/Antigravity"; // Adjust path if needed
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSignIn = (e) => {
    e.preventDefault();

    // 1. Set login status
    localStorage.setItem("isLoggedIn", "true");

    // 2. Save the Email entered by the user
    // (Ensure you have 'const [email, setEmail] = useState("");' defined in your component)
    localStorage.setItem("eidos_user_email", email || "user@eidos.app");

    // 3. If no name exists from a previous signup, set a default
    if (!localStorage.getItem("eidos_user_name")) {
      localStorage.setItem("eidos_user_name", "Welcome Back");
    }

    // 4. Handle Redirection
    const pendingUrl = sessionStorage.getItem("pendingUrl");
    if (pendingUrl) {
      // If user came from a specific analysis, take them back to that work
      router.push(`/dashboard?url=${encodeURIComponent(pendingUrl)}`);
      sessionStorage.removeItem("pendingUrl");
    } else {
      // Otherwise, just head to the clean dashboard
      router.push("/dashboard");
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#050505] flex overflow-hidden">
        {/* LEFT SIDE: THE INTERACTIVE VISUAL */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#080808] border-r border-white/5 items-center justify-center overflow-hidden">
          {/* Antigravity Component as Background - Same as Signup */}
          <div className="absolute inset-0 z-0">
            <Antigravity
              count={400}
              magnetRadius={8}
              ringRadius={6}
              waveSpeed={0.5}
              waveAmplitude={1.2}
              particleSize={1.2}
              lerpSpeed={0.4}
              color="#0052f5"
              autoAnimate
              particleVariance={1}
              particleShape="sphere"
              fieldStrength={15}
            />
          </div>

          {/* Floating Content over the Particles - Updated Copywriting */}
          <div className="relative z-10 p-12 max-w-lg pointer-events-none">
            <div className="flex items-center gap-3 mb-10">
              <img src="/logo.svg" alt="Eidos" className="w-10 h-10" />
              <span className="text-white font-bold text-2xl tracking-tighter">
                Eidos
              </span>
            </div>

            {/* ✅ UPDATED COPYWRITING ✅ */}
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Unlock your <br />
              <span className="text-blue-500">Insights</span> Workflow
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Resume your architectural deep dives and accelerate your
              development handoff.
            </p>
          </div>

          {/* Bottom Left Badge */}
          <div className="absolute bottom-10 left-12 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] pointer-events-none">
            A <span className="text-blue-500/50">BWP</span> PRODUCT
          </div>
        </div>

        {/* RIGHT SIDE: THE SIGN IN FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <div className="mb-10">
              {/* ✅ SIGN IN HEADER ✅ */}
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back!
              </h2>
              <p className="text-white/40">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form className="space-y-6">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-white/70">
                    Password
                  </label>
                  {/* ✅ FORGOT PASSWORD LINK ✅ */}
                  <Link
                    href="/forgot-password"
                    className="text-blue-500/80 text-xs font-medium hover:underline hover:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"} // Dynamic type
                    placeholder="Enter your password"
                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-12 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />

                  {/* ✅ PASSWORD TOGGLE BUTTON ✅ */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4"
              >
                Sign In
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

              {/* ✅ NO ACCOUNT LINK ✅ */}
              <p className="text-white/40 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-500 font-bold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
