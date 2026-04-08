"use client";
import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function CodePanel({ element }) {
  const [copying, setCopying] = useState(false);
  const [mode, setMode] = useState("css");

  if (!element) {
    return (
      <div className="flex items-center justify-center h-40 text-white/10 text-[10px] uppercase tracking-widest font-black text-center">
        Select an element <br /> to view source code
      </div>
    );
  }

  const generateCSS = () => {
    return `/* Eidos Captured Styles */
.${element.tag.toLowerCase()}-custom {
  font-family: '${element.fontFamily || "inherit"}', sans-serif;
  font-size: ${element.fontSize || "inherit"};
  color: ${element.color || "inherit"};
  background-color: ${element.backgroundColor || "transparent"};
  padding: ${element.padding || "0px"};
  border-radius: ${element.borderRadius || "0px"};
  width: ${Math.round(element.width)}px;
  height: ${Math.round(element.height)}px;
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex bg-white/5 p-1 rounded-lg gap-1">
          {["css", "tailwind"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${
                mode === m
                  ? "bg-blue-500 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          {copying ? <FiCheck /> : <FiCopy />}
          {copying ? "Copied" : "Copy Code"}
        </button>
      </div>

      <div className="relative group">
        <pre className="bg-black/40 border border-white/5 rounded-2xl p-6 overflow-x-auto custom-scroll font-mono text-[11px] leading-relaxed text-emerald-400/80">
          <code>
            {mode === "css"
              ? generateCSS()
              : `<div className="rounded-[${element.borderRadius}] p-[${element.padding}] text-[${element.fontSize}] text-[${element.color}]">
  ${element.text || "Content"}
</div>`}
          </code>
        </pre>
      </div>
    </div>
  );
}
