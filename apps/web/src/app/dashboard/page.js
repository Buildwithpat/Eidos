"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Inspector from "@/components/Inspector";
import AssetItem from "@/components/AssetItem";
import SettingsComponent from "@/components/SettingsComponent";
import UpgradeView from "@/components/UpgradeView";

import {
  FiLock,
  FiDownload,
  FiFolder,
  FiLayers,
  FiBookmark,
  FiHeart,
  FiTrash2,
  FiSearch,
  FiImage,
  FiCopy,
} from "react-icons/fi";
import JSZip from "jszip";

function DashboardContent() {
  // ✅ TRACKS WHICH SECTION IS ACTIVE
  const [activeView, setActiveView] = useState("audit"); // "audit", "saved", "assets", "exports"
  const [history, setHistory] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const searchParams = useSearchParams();

  const [exportHistory, setExportHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accentColor, setAccentColor] = useState("#2563EB"); // Default Eidos Blue
  const [codeTheme, setCodeTheme] = useState("cyberpunk");
  // Add these if they aren't there yet!
  const [analysisCount, setAnalysisCount] = useState(0); // 👈 ADD THIS LINE
  const [userPlan, setUserPlan] = useState("free");

  const syntaxColors = {
    cyberpunk: { key: accentColor, string: "#10b981", tag: "#f472b6" },
    dracula: { key: "#ff79c6", string: "#f1fa8c", tag: "#8be9fd" },
    nord: { key: "#88c0d0", string: "#a3be8c", tag: "#ebcb8b" },
    monokai: { key: "#f92672", string: "#e6db74", tag: "#66d9ef" },
  };

  // Select the current set based on your state
  const theme = syntaxColors[codeTheme] || syntaxColors.cyberpunk;

  // ✅ ASSET LOGIC: Categorizes logos, icons, and backgrounds
  // ✅ FIX: Added (history || []) to prevent 'filter of undefined' error
  const assets = useMemo(() => {
    const safeHistory = history || [];
    const all = safeHistory
      .filter((item) => item.asset)
      .map((item) => item.asset);
    return {
      all: all,
      logos: all.filter((a) => a.type === "logos"),
      icons: all.filter((a) => a.type === "icons"),
      backgrounds: all.filter((a) => a.type === "backgrounds"),
    };
  }, [history]);

  const [recentAnalyses, setRecentAnalyses] = useState([]);

  useEffect(() => {
    // 1. Get stored data
    const storedDate = localStorage.getItem("eidos_reset_date");
    const storedCount = localStorage.getItem("eidos_analysis_count");

    const today = new Date().toLocaleDateString(); // e.g., "3/29/2026"

    // 2. Check if we should reset
    if (storedDate !== today) {
      // It's a new day! Reset everything
      localStorage.setItem("eidos_reset_date", today);
      localStorage.setItem("eidos_analysis_count", "0");
      setAnalysisCount(0);
    } else {
      // Same day, just sync the state with local storage
      setAnalysisCount(parseInt(storedCount) || 0);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts if typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      const key = e.key.toUpperCase();

      switch (key) {
        case "N":
          handleNewAnalysis();
          break;
        case "A":
          setActiveView("assets");
          break;
        case "E":
          handleExportAll();
          break;
        case "S":
          setActiveView("saved");
          break;
        case "ESCAPE":
          setActiveView("audit");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, history]); // Re-bind if view changes

  const handleNewAnalysis = () => {
    setHistory([]); // Clear the current site elements
    setSelectedElement(null); // Clear inspector selection
    setActiveView("audit"); // Ensure we are on the Live Audit tab

    // Optional: Clear the URL if you want a totally clean slate
    window.history.replaceState({}, "", "/");
  };

  const fetchRecent = async () => {
    try {
      const res = await fetch("/api/analyses");
      const data = await res.json();
      // Ensure we set an array, even if the DB is empty
      setRecentAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to refresh recents", err);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchUserStats = async () => {
    try {
      const res = await fetch("/api/user/stats");
      if (res.ok) {
        const data = await res.json();
        setAnalysisCount(data.analysisCount || 0);
        setUserPlan(data.plan || "free");
      }
    } catch (err) {
      console.error("Failed to sync stats", err);
    }
  };

  // Add this useEffect to trigger the fetch on load
  useEffect(() => {
    fetchUserStats();
    fetchRecent(); // Assuming you have this to load the sidebar history
  }, []);

  const handleAnalyze = async (urlInput) => {
    if (!urlInput || isLoading) return;

    // 1. 🛡️ FREE TIER LIMIT CHECK
    if (userPlan === "free" && analysisCount >= 3) {
      setActiveView("upgrade");
      return;
    }

    setIsLoading(true);
    setActiveView("audit");

    let sanitizedUrl = urlInput.trim();
    if (!sanitizedUrl.startsWith("http")) {
      sanitizedUrl = "https://" + sanitizedUrl;
    }

    try {
      // 2. 📡 REAL EXTRACTION: Fetch colors, fonts, and assets from our API
      const extractRes = await fetch(
        `/api/extract?url=${encodeURIComponent(sanitizedUrl)}`,
      );

      // ✅ ADDED: If the database says the limit is reached (403), redirect to upgrade
      if (extractRes.status === 403) {
        setActiveView("upgrade");
        setIsLoading(false);
        return;
      }

      if (!extractRes.ok) throw new Error("Extraction failed");
      const extractedData = await extractRes.json();

      // 3. 🛠️ MAP EXTRACTED DATA TO UI STATE
      const mappedHistory = extractedData.assets.map((imgUrl, index) => ({
        tag: "IMG",
        text: `Asset ${index + 1}`,
        color: extractedData.colors[0] || "#ffffff",
        fontFamily: extractedData.fonts[0] || "Inter",
        asset: {
          url: imgUrl,
          type: "logos",
          name: `Extracted Asset ${index + 1}`,
        },
      }));

      // Update the live audit view with the new data
      setHistory(mappedHistory);
      if (mappedHistory.length > 0) setSelectedElement(mappedHistory[0]);

      // 4. 💾 SAVE TO DATABASE (PostgreSQL)
      try {
        const urlObj = new URL(sanitizedUrl);
        const domain = urlObj.hostname;

        if (domain && !domain.includes("unknown")) {
          const saveResponse = await fetch("/api/analyses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              domain: domain,
              url: sanitizedUrl,
              data: mappedHistory, // 🚀 Saving the real extracted elements
            }),
          });

          if (saveResponse.ok) {
            await fetchRecent();

            // 📈 Update State AND LocalStorage
            const newCount = analysisCount + 1;
            setAnalysisCount(newCount);
            localStorage.setItem("eidos_analysis_count", newCount.toString());
          }
        }
      } catch (dbError) {
        console.error("Database save failed:", dbError);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      // alert(
        // "Could not extract data from this site. It might be blocking scrapers.",
      // );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DATA CAPTURE: One single useEffect to handle incoming data
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) return;

    // 🛡️ Helper: Fixes stray '%' signs that crash decodeURIComponent
    const safeDecode = (str) => {
      try {
        return decodeURIComponent(str.replace(/\+/g, " "));
      } catch (e) {
        // If decoding fails, it's usually a stray '%' or malformed char.
        // This regex finds '%' not followed by two hex digits and escapes them.
        const fixedStr = str.replace(/%(?![0-9a-fA-F]{2})/g, "%25");
        return decodeURIComponent(fixedStr.replace(/\+/g, " "));
      }
    };

    try {
      const decoded = safeDecode(dataParam);
      const parsed = JSON.parse(decoded);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];

      const uniqueNewElements = dataArray.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.tag === item.tag &&
              t.text === item.text &&
              t.asset?.url === item.asset?.url,
          ),
      );

      const firstItem = uniqueNewElements[0];
      fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: firstItem?.domain || "unknown.com",
          url: firstItem?.url || "",
          data: uniqueNewElements,
        }),
      }).then(() => fetchRecent());

      setHistory((prev) => {
        const combined = [...uniqueNewElements, ...prev];
        return combined.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.tag === item.tag &&
                t.text === item.text &&
                t.asset?.url === item.asset?.url,
            ),
        );
      });

      if (uniqueNewElements.length > 0) {
        setSelectedElement(uniqueNewElements[0]);
      }

      // Cleanup URL
      window.history.replaceState({}, "", window.location.pathname);
    } catch (err) {
      console.error("Dashboard Data Error:", err);
      // Ensure the bad URL is cleared even on failure so the crash doesn't loop
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  // ✅ DESIGN SYSTEM LOGIC: Extracts unique colors and fonts
  const colors = useMemo(
    () => [
      ...new Set(
        (history || [])
          .flatMap((el) => [
            el.color,
            el.backgroundColor !== "#000000" &&
            el.backgroundColor !== "transparent"
              ? el.backgroundColor
              : null,
          ])
          .filter((c) => c && c !== "transparent" && c !== "rgba(0, 0, 0, 0)"),
      ),
    ],
    [history],
  );

  const fonts = useMemo(
    () => [...new Set(history.map((el) => el.fontFamily).filter(Boolean))],
    [history],
  );

  const [savedItems, setSavedItems] = useState([]);

  // ✅ HANDLES DOWNLOADS FOR BOTH PNG AND SVG
  const downloadAsset = (item) => {
    const data = item.asset || item;
    const fileName = data.name ? data.name.replace(/\s+/g, "-") : "eidos-asset";
    const isSvg =
      data.code || (typeof data === "string" && data.includes("<svg"));
    const content = data.code || data;

    if (isSvg) {
      const blob = new Blob([content], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (data.url) {
      const link = document.createElement("a");
      link.href = data.url;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Function to toggle Save/Unsave
  const toggleSave = (e, item) => {
    e.stopPropagation();
    setSavedItems((prev) => {
      const isSaved = prev.some(
        (s) => s.tag === item.tag && s.text === item.text,
      );
      if (isSaved) {
        return prev.filter(
          (s) => !(s.tag === item.tag && s.text === item.text),
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const handleExportAll = async () => {
    if (history.length === 0 && savedItems.length === 0) {
      alert("Nothing to export yet!");
      return;
    }

    const zip = new JSZip();
    const timestamp = new Date().toLocaleString();
    const projectName = history[0]?.domain || "eidos-project";

    // 1. Organize Design Tokens (Theme)
    const themeData = {
      projectName,
      exportedAt: timestamp,
      colors: colors,
      fonts: fonts,
    };
    zip.file("theme/design-tokens.json", JSON.stringify(themeData, null, 2));

    // 2. Organize Components (Saved Items)
    if (savedItems.length > 0) {
      const componentsData = savedItems.map((item) => ({
        tag: item.tag,
        text: item.text,
        styles: item.styles,
        html: item.html || "No HTML captured",
      }));
      zip.file(
        "components/library.json",
        JSON.stringify(componentsData, null, 2),
      );
    }

    // 3. Organize Assets (Icons/Logos)
    const assetsFolder = zip.folder("assets");
    const allAssets = [...assets.logos, ...assets.icons, ...assets.backgrounds];

    allAssets.forEach((asset, index) => {
      const fileName = asset.name
        ? asset.name.replace(/\s+/g, "-").toLowerCase()
        : `asset-${index}`;
      if (asset.code) {
        assetsFolder.file(`${fileName}.svg`, asset.code);
      } else if (asset.url) {
        assetsFolder.file(`${fileName}-link.txt`, `Source URL: ${asset.url}`);
      }
    });

    // 4. Generate ZIP
    const content = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(content);

    // 5. Log it to History
    const newExport = {
      id: Date.now(),
      name: `${projectName}-handoff.zip`,
      date: timestamp,
      size: (content.size / 1024 / 1024).toFixed(2) + " MB",
      count: savedItems.length + allAssets.length,
      url: downloadUrl,
    };
    setExportHistory((prev) => [newExport, ...prev]);

    // 6. Trigger Download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = newExport.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="flex h-screen w-full bg-[#05070B] overflow-hidden"
      suppressHydrationWarning
    >
      {/* LEFT NAVIGATION */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          recentAnalyses={recentAnalyses} // Pass the data
          setHistory={setHistory}
          onNewAnalysis={handleNewAnalysis}
          fetchRecent={fetchRecent}
          accentColor={accentColor}
          analysisCount={analysisCount} // 👈 Add this
          userPlan={userPlan}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* --------------------------------------------------------- */}
        {/* 📂 SAVED VIEW SECTION                                     */}
        {/* --------------------------------------------------------- */}
        {activeView === "saved" && (
          <div className="flex-1 bg-[#05070B] overflow-y-auto custom-scroll p-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Saved Components
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  Your personal library of extracted UI elements.
                </p>
              </div>
              <button
                onClick={() => setActiveView("audit")}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[18px] font-bold text-blue-500 hover:bg-blue-500 hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer flex items-center justify-center"
              >
                ←
              </button>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div className="relative max-w-2xl">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="Search components..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                />
              </div>
              <div className="flex items-center gap-3">
                {["All", "Buttons", "Cards", "Navbars", "Forms"].map((cat) => (
                  <button
                    key={cat}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = accentColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {savedItems.length > 0 ? (
                savedItems.map((item, i) => (
                  <div
                    key={i}
                    className="group bg-[#0A0C10] border border-white/5 rounded-[32px] p-2 hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
                  >
                    <div className="h-48 bg-[#05070B] rounded-[26px] mb-6 flex items-center justify-center border border-white/5 relative overflow-hidden p-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* 🛠️ THE FIX: Handles both SVG code objects and raw strings */}
                      {item.asset?.code ||
                      (typeof item.asset === "string" &&
                        item.asset.includes("<svg")) ? (
                        <div
                          className="w-full h-full flex items-center justify-center text-white fill-current svg-preview"
                          dangerouslySetInnerHTML={{
                            __html: (item.asset?.code || item.asset)
                              .replace(
                                /<svg/,
                                '<svg style="width:100%; height:100%; max-width:120px; max-height:120px;"',
                              )
                              .replace(/fill="[^"]*"/g, 'fill="currentColor"'),
                          }}
                        />
                      ) : item.asset?.url ? (
                        <img
                          src={item.asset.url}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        /* Standard component fallback */
                        <div
                          style={{
                            backgroundColor: item.backgroundColor || "#1553E2",
                            color: item.color || "white",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.text || "Component"}
                        </div>
                      )}
                    </div>
                    <div className="px-5 pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-500/10 rounded-md tracking-tight">
                          {item.tag}
                        </span>
                        <h3 className="text-white font-bold text-lg truncate tracking-tight">
                          {item.text || "Unnamed Element"}
                        </h3>
                      </div>
                      <p className="text-white/20 text-[11px] mb-8 font-medium italic">
                        Source: Captured via Eidos
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const codeToCopy =
                              item.asset?.code ||
                              item.text ||
                              "No code available";
                            navigator.clipboard.writeText(codeToCopy);
                          }}
                          className="flex-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
                        >
                          Copy Code
                        </button>
                        <button
                          onClick={() => downloadAsset(item)} // Or (asset) if in the asset loop
                          className="px-4 py-3 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                          <FiDownload />
                        </button>
                        <button
                          onClick={(e) => toggleSave(e, item)}
                          className="px-4 py-3 bg-red-500/5 text-red-500/40 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
                  <FiBookmark className="text-5xl text-white/5 mb-6" />
                  <p className="text-white/20 font-bold uppercase text-[12px] tracking-[0.4em]">
                    No saved components yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "upgrade" && (
          <UpgradeView
            accentColor={accentColor}
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            setActiveView={setActiveView}
          />
        )}

        {/* --------------------------------------------------------- */}
        {/* --------------------------------------------------------- */}
        {/* 🖼️ ASSETS VIEW SECTION                                     */}
        {/* --------------------------------------------------------- */}
        {activeView === "assets" && (
          <div className="flex-1 bg-[#05070B] overflow-y-auto custom-scroll p-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Assets
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  Browse and download assets extracted from websites.
                </p>
              </div>
              <button
                onClick={() => setActiveView("audit")}
                style={{ color: accentColor, borderColor: `${accentColor}33` }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[18px] font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer flex items-center justify-center"
              >
                ←
              </button>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div className="relative max-w-2xl">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                />
              </div>
              <div className="flex items-center gap-3">
                {["All", "Logos", "Icons", "SVG", "Backgrounds"].map((cat) => (
                  <button
                    key={cat}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = accentColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {assets.all.length > 0 ? (
                assets.all.map((asset, i) => (
                  <div
                    key={i}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = `${accentColor}66`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.05)")
                    }
                    className="group bg-[#0A0C10] border border-white/5 rounded-3xl p-4 hover:border-blue-500/30 transition-all duration-500"
                  >
                    <div className="aspect-square bg-[#05070B] rounded-2xl mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden p-8">
                      {/* ✅ ASSET SVG PREVIEW FIX: Use dangerouslySetInnerHTML */}
                      {asset.code ? (
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto text-white fill-current"
                          dangerouslySetInnerHTML={{ __html: asset.code }}
                        />
                      ) : asset.url ? (
                        <img
                          src={asset.url}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <FiImage className="text-white/10 text-4xl" />
                      )}
                    </div>
                    <div className="px-2">
                      <h3 className="text-white font-bold text-sm truncate mb-1">
                        {asset.name || "Unnamed Asset"}
                      </h3>
                      <p className="text-white/20 text-[10px] font-medium uppercase tracking-tighter mb-4">
                        Type: {asset.type}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadAsset(asset)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2 rounded-lg border border-white/5 transition-all cursor-pointer"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => {
                            if (asset.code)
                              navigator.clipboard.writeText(asset.code);
                            else if (asset.url)
                              navigator.clipboard.writeText(asset.url);
                          }}
                          className="px-3 py-2 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                          <FiCopy />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px]">
                  <FiImage className="text-5xl text-white/5 mb-6" />
                  <p className="text-white/20 font-bold uppercase text-[12px] tracking-[0.4em]">
                    No assets captured yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* 📦 EXPORTS VIEW SECTION                                     */}
        {/* --------------------------------------------------------- */}
        {activeView === "exports" && (
          <div className="flex-1 bg-[#05070B] overflow-y-auto custom-scroll p-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Export History
                </h1>
                <p className="text-white/40 text-sm">
                  Review and re-download your generated handoff packages.
                </p>
              </div>
              <button
                onClick={() => setActiveView("audit")}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[18px] font-bold text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              >
                ←
              </button>
            </div>

            <div className="space-y-4">
              {exportHistory.length > 0 ? (
                exportHistory.map((exp) => (
                  <div
                    key={exp.id}
                    className="group flex items-center justify-between bg-[#0A0C10] border border-white/5 p-6 rounded-[24px] hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-xl border border-blue-500/20">
                        <FiDownload />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {exp.name}
                        </h3>
                        <p className="text-white/20 text-xs font-medium uppercase tracking-widest">
                          {exp.date} • {exp.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <p className="text-white/60 text-xs font-bold uppercase mb-1">
                          Contents
                        </p>
                        <p className="text-blue-500 text-[10px] font-black tracking-widest uppercase">
                          {exp.count} Items • Theme JSON
                        </p>
                      </div>
                      <a
                        href={exp.url}
                        download={exp.name}
                        className="px-6 py-3 bg-blue-600 text-white text-[11px] font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                      >
                        Re-Download
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] opacity-20">
                  <FiDownload className="text-5xl mb-4" />
                  <p className="font-black uppercase text-[10px] tracking-[0.4em]">
                    No exports generated yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* ⚙️ SETTINGS VIEW SECTION                                   */}
        {/* --------------------------------------------------------- */}
        {/* PASTE THIS INSTEAD */}
        {activeView === "settings" && (
          <div className="fixed inset-0 z-[100] bg-[#05070B] overflow-hidden">
            <SettingsComponent
              setActiveView={setActiveView}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              codeTheme={codeTheme}
              setCodeTheme={setCodeTheme}
              userPlan={userPlan}
            />
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* 🛠️ AUDIT VIEW SECTION                                      */}
        {/* --------------------------------------------------------- */}
        {activeView === "audit" && (
          <>
            <Topbar
              onAnalyze={handleAnalyze}
              onExport={handleExportAll}
              isLoading={false}
              accentColor={accentColor}
              setActiveView={setActiveView}
            />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* MAIN COLUMN: LIVE AUDIT & INSPECTOR */}
              <div className="flex flex-col flex-1 border-r border-white/5 bg-[#080A0F] overflow-hidden">
                <div className="flex-1 p-6 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                      <h1 className="text-white font-bold text-lg uppercase tracking-tight">
                        Live Audit
                      </h1>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-3 text-white">
                    {history.length > 0 ? (
                      history.map((item, i) => {
                        const isSaved = savedItems.some(
                          (s) => s.tag === item.tag && s.text === item.text,
                        );

                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedElement(item)}
                            className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                              selectedElement === item
                                ? "bg-blue-600/10 border-blue-500/40 shadow-lg"
                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-500/10 rounded tracking-tight">
                                  {item.tag}
                                </span>
                                <p className="text-white/60 text-[13px] truncate max-w-[200px]">
                                  {item.text
                                    ? `"${item.text}"`
                                    : "Element Captured"}
                                </p>
                              </div>

                              <button
                                onClick={(e) => toggleSave(e, item)}
                                className={`transition-all duration-200 cursor-pointer p-1 rounded-md hover:bg-white/5 ${
                                  isSaved
                                    ? "text-red-500 opacity-100"
                                    : "text-white/20 opacity-0 group-hover:opacity-100 hover:text-white"
                                }`}
                              >
                                <FiHeart
                                  className={`w-3.5 h-3.5 ${
                                    isSaved ? "fill-current" : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                        <FiBookmark className="text-4xl" />
                        <p className="font-bold uppercase text-[10px] tracking-[0.4em] text-center">
                          Awaiting captures...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[340px] border-t border-white/10 bg-[#05070B] p-6 shrink-0 overflow-hidden">
                  <Inspector
                    history={history}
                    selectedElement={selectedElement}
                    codeTheme={codeTheme}
                  />
                </div>
              </div>

              {/* RIGHT SIDEBAR (DESIGN SYSTEM) */}
              <div className="w-[300px] xl:w-[360px] flex flex-col p-8 space-y-12 overflow-y-auto custom-scroll shrink-0 border-l border-white/5 bg-[#05070B]">
                <section className="mb-10">
                  <div
                    className={`p-5 rounded-2xl font-mono text-[11px] border border-white/5 transition-all duration-500 ${
                      codeTheme === "dracula"
                        ? "bg-[#282a36] text-[#f8f8f2]"
                        : codeTheme === "nord"
                          ? "bg-[#2e3440] text-[#d8dee9]"
                          : codeTheme === "monokai"
                            ? "bg-[#272822] text-[#f8f8f2]"
                            : "bg-[#0A0C10] text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                      <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold">
                        Syntax Preview
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-widest font-bold"
                        style={{ color: accentColor }}
                      >
                        {codeTheme}
                      </span>
                    </div>

                    <code className="block whitespace-pre-wrap leading-relaxed opacity-80">
                      {selectedElement ? (
                        <>
                          <span style={{ color: theme.tag }}>.extracted</span>{" "}
                          {"{ \n"}
                          <span style={{ color: theme.key }}> tag</span>:{" "}
                          {selectedElement.tag}; {"\n"}
                          <span style={{ color: theme.key }}> color</span>:{" "}
                          <span style={{ color: theme.string }}>
                            {accentColor}
                          </span>
                          ; {"\n"}
                          {"}"}
                        </>
                      ) : (
                        "// Select element to inspect"
                      )}
                    </code>
                  </div>
                </section>
                <section>
                  <h3
                    style={{ color: accentColor }}
                    className=" text-[11px] font-bold uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
                  >
                    <FiLayers /> Design System
                  </h3>
                  <div className="space-y-10">
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase mb-5 tracking-widest">
                        Colors
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
                          <p className="text-neutral-500 text-[11px] font-medium italic">
                            No colors yet
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase mb-5 tracking-widest">
                        Fonts
                      </p>
                      <div className="space-y-3">
                        {fonts.length > 0 ? (
                          fonts.map((f) => (
                            <div
                              key={f}
                              className="text-white text-[16px] font-normal tracking-tight"
                            >
                              {f}
                            </div>
                          ))
                        ) : (
                          <p className="text-neutral-500 text-[11px] font-medium italic">
                            No fonts detected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="space-y-8">
                  <h3
                    style={{ color: accentColor }}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <FiFolder /> Assets
                  </h3>
                  {["logos", "icons", "backgrounds"].map((cat) => (
                    <div key={cat}>
                      <p className="text-white/80 text-[10px] font-bold uppercase mb-4 tracking-[0.2em] flex justify-between items-center">
                        <span className="capitalize">{cat}</span>
                        <span
                          style={{ color: accentColor }}
                          className="text-blue-500 font-bold"
                        >
                          ({assets[cat].length})
                        </span>
                      </p>
                      <div className="space-y-2">
                        {assets[cat].length > 0 ? (
                          assets[cat].map((a, i) => (
                            <AssetItem
                              key={i}
                              asset={a}
                              accentColor={accentColor}
                            />
                          ))
                        ) : (
                          <div className="text-[11px] text-neutral-500 font-bold bg-white/5 py-4 border border-dashed border-white/10 rounded-xl text-center uppercase tracking-tighter px-4">
                            No {cat} captured yet
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
                <div className="relative p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent overflow-hidden mt-auto">
                  <div className="absolute inset-0 backdrop-blur-[12px] bg-black/70 z-10 flex flex-col items-center justify-center border border-white/10 rounded-3xl">
                    <div
                      style={{ color: accentColor }}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse"
                    >
                      <FiLock /> Coming Soon
                    </div>
                  </div>
                  <div className="relative z-0 opacity-20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <h4 className="text-white font-bold text-sm">Eido AI</h4>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      Generate production-ready React components from your
                      audit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#05070B]" />}>
      <DashboardContent />
    </Suspense>
  );
}
