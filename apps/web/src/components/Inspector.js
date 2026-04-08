"use client";
import React, { useState, useEffect } from "react";
import { FiType, FiMaximize, FiInfo, FiBox, FiCopy, FiCheck } from "react-icons/fi";
import CodePanel from "./CodePanel";

export default function Inspector({ history, selectedElement, accentColor, codeTheme }) {
  const [activeTab, setActiveTab] = useState("inspect");
  const [mounted, setMounted] = useState(false);
  const [codeType, setCodeType] = useState("tailwind");

  const syntaxColors = {
    cyberpunk: { key: accentColor, string: "#10b981", tag: "#f472b6" },
    dracula: { key: "#ff79c6", string: "#f1fa8c", tag: "#8be9fd" },
    nord: { key: "#88c0d0", string: "#a3be8c", tag: "#ebcb8b" },
    monokai: { key: "#f92672", string: "#e6db74", tag: "#66d9ef" },
  };

  const theme = syntaxColors[codeTheme] || syntaxColors.cyberpunk;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Use ?. everywhere to prevent the crash
    const tag = selectedElement?.tag?.toLowerCase() || "div";
    const radius = selectedElement?.borderRadius || "0px";
    const padding = selectedElement?.padding || "0px";
    const size = selectedElement?.fontSize || "16px";
    const text = selectedElement?.text || "";

    const codeString = `<${tag} className="rounded-[${radius}] p-[${padding}] text-[${size}]">\n  ${text}\n</${tag}>`;

    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-[#05070B]" />;

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-10">
        <FiBox size={40} strokeWidth={1} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">
          Select element to inspect
        </p>
      </div>
    );
  }

  const SpecBox = ({ title, icon: Icon, children }) => (
    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors min-w-[280px]">
      <h4 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
        <Icon size={12} /> {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, value, isColor = false }) => (
    <div className="flex justify-between items-center text-[13px]">
      <span className="text-white/30 font-normal uppercase text-[10px] tracking-tight">
        {label}
      </span>
      <div className="flex items-center gap-2 max-w-[180px]">
        {isColor && value && value !== "transparent" && (
          <div
            className="w-3 h-3 rounded-full border border-white/10"
            style={{ backgroundColor: value }}
          />
        )}
        <span className="text-white font-normal truncate">{value || "—"}</span>
      </div>
    </div>
  );

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
        <FiInfo size={32} />
        <p className="font-bold uppercase text-[10px] tracking-[0.4em] text-center">
          Select an element to inspect
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* TABS HEADER */}
      <div className="flex gap-10 border-b border-white/5 mb-6 shrink-0">
        {["inspect", "code"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={
              activeTab === tab
                ? { color: accentColor, borderBottomColor: accentColor }
                : {}
            }
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer border-b-2 ${
              activeTab === tab
                ? "active"
                : "text-white/20 hover:text-white/40 border-transparent"
            }`}
          >
            {tab === "inspect" ? "Element Specs" : "Source Code"}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scroll pb-4">
        {activeTab === "inspect" ? (
          <div className="flex flex-wrap gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* TYPOGRAPHY */}
            <SpecBox title="Typography" icon={FiType}>
              <Row
                label="Font"
                value={selectedElement?.fontFamily || "Default"}
              />
              <Row label="Size" value={selectedElement?.fontSize || "14px"} />
              <Row
                label="Weight"
                value={selectedElement?.fontWeight || "400"}
              />
              <Row
                label="Color"
                value={selectedElement?.color || "#FFFFFF"}
                isColor
              />
            </SpecBox>

            {/* APPEARANCE */}
            <SpecBox title="Appearance" icon={FiMaximize}>
              <Row
                label="Background"
                value={
                  selectedElement?.backgroundImage
                    ? "Linear Gradient"
                    : selectedElement?.backgroundColor || "Transparent"
                }
                isColor={!selectedElement?.backgroundImage}
              />
              {selectedElement?.border && (
                <Row label="Border" value={selectedElement.border} />
              )}
              <Row label="Padding" value={selectedElement?.padding || "0px"} />
              <Row
                label="Radius"
                value={selectedElement?.borderRadius || "0px"}
              />
            </SpecBox>

            {/* GEOMETRY */}
            <SpecBox title="Geometry" icon={FiInfo}>
              <Row
                label="Width"
                value={`${Math.round(selectedElement?.width || 0)}px`}
              />
              <Row
                label="Height"
                value={`${Math.round(selectedElement?.height || 0)}px`}
              />
              <Row label="Tag" value={selectedElement?.tag || "div"} />
            </SpecBox>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEADER ROW: SOLID COLORED TOGGLE + COPY BUTTON */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                {["css", "tailwind"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setCodeType(t)}
                    style={
                      codeType === t
                        ? {
                            backgroundColor: accentColor,
                            color: "white",
                            boxShadow: `0 0 20px ${accentColor}4D`,
                          }
                        : {}
                    }
                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                      codeType === t
                        ? "opacity-100"
                        : "text-white/30 hover:text-white/60 hover:bg-white/5"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                style={{ color: copied ? "#10b981" : accentColor }}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 px-5 py-2.5 rounded-xl border border-white/5 transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="w-3 h-3" /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* DYNAMIC CODE PANEL WITH SWITCH LOGIC */}
            <div className="p-8 rounded-[24px] border border-white/5 bg-[#05070B] font-mono text-xs leading-relaxed overflow-x-auto h-full min-h-[250px] shadow-2xl">
              {codeType === "tailwind" ? (
                <code className="text-white/40 block leading-relaxed">
                  <span style={{ color: theme.tag }}>
                    &lt;{selectedElement?.tag?.toLowerCase() || "div"}
                  </span>
                  <span style={{ color: theme.key }}> className</span>=
                  <span style={{ color: theme.string }}>
                    "rounded-[{selectedElement?.borderRadius || "0px"}] p-[
                    {selectedElement?.padding || "0px"}] text-[
                    {selectedElement?.fontSize || "14px"}]"
                  </span>
                  <span style={{ color: theme.tag }}>&gt;</span>
                  <div className="pl-6 py-1 text-white/90 border-l border-white/10 ml-2 mt-2 mb-2">
                    {selectedElement?.text || "Element Content"}
                  </div>
                  <span style={{ color: theme.tag }}>
                    &lt;/{selectedElement?.tag?.toLowerCase() || "div"}&gt;
                  </span>
                </code>
              ) : (
                <code className="text-white/40 block">
                  <span style={{ color: theme.tag }}>
                    .{selectedElement?.tag?.toLowerCase() || "element"}
                  </span>{" "}
                  {"{"}
                  <div className="pl-6 py-2">
                    <div className="mb-1">
                      <span style={{ color: theme.key }}>border-radius</span>:{" "}
                      <span style={{ color: theme.string }}>
                        {selectedElement?.borderRadius || "0px"}
                      </span>
                      ;
                    </div>
                    <div className="mb-1">
                      <span style={{ color: theme.key }}>padding</span>:{" "}
                      <span style={{ color: theme.string }}>
                        {selectedElement?.padding || "0px"}
                      </span>
                      ;
                    </div>
                    <div className="mb-1">
                      <span style={{ color: theme.key }}>font-size</span>:{" "}
                      <span style={{ color: theme.string }}>
                        {selectedElement?.fontSize || "14px"}
                      </span>
                      ;
                    </div>
                    <div className="mb-1">
                      <span style={{ color: theme.key }}>color</span>:{" "}
                      <span style={{ color: theme.string }}>
                        {selectedElement?.color || "inherit"}
                      </span>
                      ;
                    </div>
                  </div>
                  {"}"}
                </code>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
