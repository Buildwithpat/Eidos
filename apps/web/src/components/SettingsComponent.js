// import React, { useState } from "react";
import {
  FiUser,
  FiGlobe,
  FiLayers,
  FiLock,
  FiCreditCard,
  FiShield,
  FiUpload,
  FiSettings,
  FiArrowLeft,
  FiCheck,
  FiHelpCircle,
  FiLogOut,
  FiSearch,
  FiZap,
  FiBox
} from "react-icons/fi";
import React, { useState, useEffect } from "react"; // 👈 Add useEffect here

export default function SettingsComponent({
  setActiveView,
  accentColor,
  setAccentColor,
  codeTheme, // <--- Add this
  setCodeTheme,
  userPlan,
}) {
  const [innerTab, setInnerTab] = useState("profile");
  const [name, setName] = useState(""); // Initial value
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 👈 ADD THIS LINE
  const [avatar, setAvatar] = useState("✌️"); // Default
  // window.location.reload(); // 👈 This is the "Product" shortcut until we add Global State

  // State for the theme preset
  // const [accentColor, setAccentColor] = useState("#2563EB");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (data) {
          // This ensures the big circle and inputs stay synced with the DB
          if (data.image) setAvatar(data.image);
          if (data.name) setName(data.name);
          if (data.email) setEmail(data.email);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    };

    loadProfileData();
  }, []); // Empty array means: run this once when the settings page opens

  // ✅ PERSIST THEME ON REFRESH
  useEffect(() => {
    const savedColor = localStorage.getItem("user-theme-color");
    if (savedColor) {
      setAccentColor(savedColor);
    }
  }, [setAccentColor]);

  useEffect(() => {
    // 1. Retrieve data from localStorage
    const storedName = localStorage.getItem("eidos_user_name");
    const storedEmail = localStorage.getItem("eidos_user_email");

    // 2. Set the Name state
    if (storedName) {
      setName(storedName);
    } else {
      setName("Guest User");
    }

    // 3. Set the Email state
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setEmail("user@eidos.app"); // Fallback email
    }
  }, []);

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "appearance", label: "Appearance", icon: <FiLayers /> },
    { id: "billing", label: "Billing", icon: <FiCreditCard /> },
    { id: "help", label: "Help", icon: <FiHelpCircle /> },
  ];

  const themePresets = [
    { name: "Blue", hex: "#2563EB" },
    { name: "Purple", hex: "#7C3AED" },
    { name: "Pink", hex: "#DB2777" },
    { name: "Emerald", hex: "#10B981" },
    { name: "Amber", hex: "#F59E0B" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // ✅ Added accentColor and image to the payload
        body: JSON.stringify({
          name,
          email,
          accentColor,
          image: avatar,
        }),
      });

      // ✅ Sync LocalStorage as well for instant refresh persistence
      localStorage.setItem("user-theme-color", accentColor);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // ✅ Tell the Topbar to refresh
      window.dispatchEvent(new Event("user-updated"));
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();

        if (data.imageUrl) {
          // 1. Update the local Settings circle instantly
          const newImageUrl = `${data.imageUrl}?t=${Date.now()}`;
          setAvatar(newImageUrl);

          // 2. Tell the Topbar to refresh without reloading the whole page
          window.dispatchEvent(new Event("user-updated"));

          console.log("Avatar updated successfully");
        } else {
          console.error("Server error:", data.error);
        }
      } else {
        const textError = await res.text();
        console.error("Server sent non-JSON response:", textError);
      }
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const BillingSection = ({ userPlan, accentColor, setActiveView }) => {
    // Logic for dates and labels
    const isFree = userPlan === "free";
    const validUntil = "April 29, 2026"; // In a real app, this comes from your DB

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* CURRENT PLAN HEADER */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold mb-1">
              Current Subscription
            </p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {userPlan} <span style={{ color: accentColor }}>Plan</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/20 mb-1">
              Status
            </p>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
              Active
            </span>
          </div>
        </div>

        {/* PLAN DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold mb-3">
              Valid Until
            </p>
            <p className="text-white text-sm font-light">
              {isFree ? "Lifetime Access" : validUntil}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold mb-3">
              Billing Cycle
            </p>
            <p className="text-white text-sm font-light">
              {isFree ? "Not Applicable" : "Monthly Auto-renewal"}
            </p>
          </div>
        </div>

        {/* DYNAMIC DESCRIPTION */}
        <div className="p-6 rounded-2xl border border-dashed border-white/10">
          <p className="text-white/40 text-[12px] font-light leading-relaxed">
            {isFree
              ? "You are currently on the Free Tier. You have access to 3 site analyses per day and basic CSS inspection. Upgrade to unlock Tailwind CSS and unlimited exports."
              : `You are on the ${userPlan} plan. You have full access to all extraction tools, unlimited history, and high-speed site analysis.`}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={() => setActiveView("upgrade")}
            style={{
              borderColor: `${accentColor}4D`,
              color: accentColor,
              fontWeight: 300, // ✅ Keeping it thin as requested
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = `${accentColor}1A`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            className="w-full py-3 border rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            {isFree ? "Upgrade Plan" : `Extend ${userPlan} Subscription`}
          </button>

          {!isFree && (
            <button className="w-full py-3 text-white/20 text-[10px] uppercase tracking-[0.2em] hover:text-red-500/60 transition-colors cursor-pointer font-light">
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#05070B] text-white overflow-hidden">
      {/* 1. FIXED TOP HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 backdrop-blur-md bg-black/20 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("audit")}
            className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-white/40 hover:text-white"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Settings</h1>
            <p className=" mt-1 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
              Account Management
            </p>
          </div>
        </div>

        {/* NEW UPDATED CODE */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving
              ? "#1e293b"
              : showSuccess
                ? "#10B981"
                : accentColor,
            boxShadow:
              isSaving || showSuccess ? "none" : `0 0 20px ${accentColor}4D`,
          }}
          className="px-8 py-2.5 text-white font-semibold rounded-lg hover:brightness-110 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            "Saving..."
          ) : showSuccess ? (
            <>
              <FiCheck /> Saved
            </>
          ) : (
            "Save"
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. FIXED LEFT SUB-NAV */}
        <aside className="w-80 border-r border-white/5 p-8 space-y-2 shrink-0 overflow-y-auto custom-scroll">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setInnerTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                innerTab === item.id
                  ? "shadow-lg border-transparent" // ✅ Removed blue classes, kept the shadow
                  : "text-white/20 border-transparent hover:text-white hover:bg-white/5"
              }`}
              style={
                innerTab === item.id
                  ? {
                      color: accentColor,
                      borderColor: `${accentColor}33`, // 20% opacity border
                      backgroundColor: `${accentColor}1A`, // 10% opacity background
                      boxShadow: `0 10px 15px -3px ${accentColor}1A`, // Dynamic themed shadow
                    }
                  : {}
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer border border-transparent">
            <FiLogOut size={18} />
            Logout
          </button>
        </aside>

        {/* 3. SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scroll p-12 lg:p-20">
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* PROFILE TAB */}
            {innerTab === "profile" && (
              <>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight">
                    Profile
                  </h2>
                  <p className="text-white/40 font-medium">
                    Manage your public information and avatar.
                  </p>
                </div>

                <div className="p-10 rounded-[20px] border border-white/5 bg-white/[0.01] backdrop-blur-3xl space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                  <div className="relative group">
                    {/* Use the accentColor for the start of the gradient, and a fallback indigo for the end */}
                    <div
                      style={{
                        background: `linear-gradient(to top right, ${accentColor}, #4f46e5)`,
                      }}
                      className="w-40 h-40 rounded-full p-1 shadow-2xl transition-all duration-300"
                    >
                      <div className="w-full h-full rounded-full bg-[#05070B] flex items-center justify-center overflow-hidden">
                        {avatar.startsWith("/") ? (
                          <img
                            src={avatar}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl">{avatar}</span>
                        )}
                      </div>
                    </div>

                    {/* Hidden Input */}
                    <input
                      type="file"
                      id="avatarInput"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <button
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <FiUpload /> Upload Avatar
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name} // 👈 Change defaultValue to value
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-2 bg-white/[0.03] border border-white/10 rounded-lg px-6 py-5 text-white font-bold text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 bg-white/[0.02] border border-white/5 rounded-lg px-6 py-5 text-white/30 font-bold text-sm cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
                      Account Security
                    </label>
                    <div className="flex items-start">
                      <button
                        style={{
                          borderColor: `${accentColor}33`, // 20% opacity (0.2 * 255 = ~33 in hex)
                          color: accentColor,
                          backgroundColor: `${accentColor}1A`, // 10% opacity (0.1 * 255 = ~1A in hex)
                        }}
                        className="text-[11px] font-bold uppercase tracking-widest px-8 py-3 rounded-lg active:scale-95 transition-all cursor-pointer hover:brightness-125"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* 🛡️ 2FA Section (Preserved) */}
                  <div className="pt-12 border-t border-white/5">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-8 flex items-start gap-6">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                        <FiLock size={20} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-bold tracking-tight">
                            Two-Factor Authentication
                          </h4>
                          <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[9px] font-black rounded uppercase tracking-tighter">
                            Planned
                          </span>
                        </div>
                        <p className="text-white/30 text-xs leading-relaxed max-w-md">
                          We are currently developing deep security
                          integrations. 2FA will be available in the v2.0
                          release.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* --- APPEARANCE TAB (New Feature) --- */}
            {innerTab === "appearance" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight">
                    Appearance
                  </h2>
                  <p className="text-white/40 font-medium">
                    Customize your workspace and code editor aesthetics.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT: THEME SELECTOR */}
                  <div className="p-10 rounded-[20px] border border-white/5 bg-white/[0.01] backdrop-blur-3xl space-y-10">
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
                        Interface Accent
                      </label>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {themePresets.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => {
                              // 1. Update the UI state immediately
                              setAccentColor(color.hex);
                              // 2. Save the choice to the browser's local storage
                              localStorage.setItem(
                                "user-theme-color",
                                color.hex,
                              );
                            }}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                              accentColor === color.hex
                                ? "ring-4 ring-white/10"
                                : ""
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {accentColor === color.hex && (
                              <FiCheck className="text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
                        Code Snippet Theme
                      </label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {["Cyberpunk", "Dracula", "Monokai", "Nord"].map(
                          (t) => (
                            <button
                              key={t}
                              onClick={() => setCodeTheme(t.toLowerCase())} // ✅ Updates global state
                              className={`py-3 px-4 border rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all text-left cursor-pointer ${
                                codeTheme === t.toLowerCase()
                                  ? "bg-white/10 border-white/20 text-white"
                                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                              }`}
                            >
                              {t}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: THE PREVIEW BOX (Fills the empty space) */}
                  <div className="p-1 rounded-[20px] bg-gradient-to-br from-white/10 to-transparent">
                    <div className="bg-[#0A0C10] rounded-[18px] h-full overflow-hidden flex flex-col">
                      {/* Mock Mac Terminal Header */}
                      <div className="px-4 py-3 border-b border-white/5 flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                        <span className="ml-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          Preview: Syntax Highlighting
                        </span>
                      </div>

                      {/* Mock Code Content */}
                      <div className="p-6 font-mono text-xs leading-relaxed">
                        <div className="flex gap-4">
                          <span className="text-white/10 select-none">01</span>
                          <p>
                            <span style={{ color: accentColor }}>
                              .eidos-glow
                            </span>{" "}
                            {"{"}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-white/10 select-none">02</span>
                          <p className="ml-4 text-white/40">
                            backdrop-filter:{" "}
                            <span className="text-emerald-400">blur(20px)</span>
                            ;
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-white/10 select-none">03</span>
                          <p className="ml-4 text-white/40">
                            box-shadow:{" "}
                            <span style={{ color: accentColor }}>
                              0 0 40px {accentColor}33
                            </span>
                            ;
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-white/10 select-none">04</span>
                          <p>{"}"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- BILLING TAB --- */}
            {innerTab === "billing" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight text-white">
                    Billing
                  </h2>
                  <p className="text-white/40 font-medium">
                    Manage your subscription plans.
                  </p>
                </div>
                <BillingSection
                  userPlan={userPlan}
                  accentColor={accentColor}
                  setActiveView={setActiveView}
                />
              </div>
            )}

            {/* --- HELP TAB --- */}
            {innerTab === "help" && (
              <div className="space-y-16 animate-in fade-in duration-700 pb-20">
                {/* HERO SEARCH */}
                <div className="text-center space-y-6 py-10">
                  <h2 className="text-5xl font-black tracking-tighter">
                    We're here to help
                  </h2>
                  <div className="relative max-w-2xl mx-auto ">
                    <FiSearch
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search for guides, shortcuts, or troubleshooting..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm font-light focus:outline-none focus:border-white/20 transition-all shadow-2xl"
                    />
                  </div>
                </div>

                {/* CATEGORY GRID (Brevo Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: "start",
                      label: "Getting Started",
                      desc: "Learn the core workflow of Eidos from capture to export.",
                      icon: <FiZap />,
                    },
                    {
                      id: "shortcuts",
                      label: "Shortcuts",
                      desc: "Master the platform with high-speed keyboard commands.",
                      icon: <FiLayers />,
                    },
                    {
                      id: "assets",
                      label: "Asset Management",
                      desc: "How to extract and optimize logos, icons, and SVGs.",
                      icon: <FiBox />,
                    },
                    {
                      id: "account",
                      label: "My Account",
                      desc: "Manage your subscription, plan limits, and profile.",
                      icon: <FiUser />,
                    },
                    {
                      id: "trouble",
                      label: "Troubleshooting",
                      desc: "Fixing common issues with site permissions and proxy.",
                      icon: <FiShield />,
                    },
                    {
                      id: "ai",
                      label: "Eido AI",
                      desc: "Upcoming features and documentation for AI component generation.",
                      icon: <FiLock />,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 text-center flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <div
                        style={{
                          color: accentColor,
                          backgroundColor: `${accentColor}10`,
                        }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110"
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">
                        {item.label}
                      </h3>
                      <p className="text-white/30 text-xs font-light leading-relaxed px-4">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* KEYBOARD SHORTCUTS CHEAT SHEET */}
                <div className="p-10 rounded-[40px] border border-dashed border-white/10 bg-white/[0.01]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-white/20 mb-10">
                    Keyboard Shortcuts
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                    {[
                      { key: "N", action: "New Analysis" },
                      { key: "S", action: "Save Element" },
                      { key: "E", action: "Export Package" },
                      { key: "A", action: "View Assets" },
                      { key: "/", action: "Quick Search" },
                      { key: "ESC", action: "Close View" },
                    ].map((kb) => (
                      <div
                        key={kb.key}
                        className="flex flex-col items-center gap-2"
                      >
                        <kbd className="px-3 py-1.5 rounded-lg bg-white/10 border-b-4 border-white/5 font-mono text-sm text-white/80">
                          {kb.key}
                        </kbd>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                          {kb.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
