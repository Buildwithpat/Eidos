// apps/web/src/components/ExtensionPromo.jsx (or wherever this file lives)

"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";

export default function ExtensionPromo() {
  // ✅ 1. Replace the Google Drive link with your GitHub Release Direct Link
  // Right-click the .zip file in your GitHub Release assets and select "Copy Link Address"
  const githubDownloadLink =
    "https://github.com/Buildwithpat/Eidos/releases/download/v1.0.0/eidos-extension.zip.zip";

  return (
    <section className="relative z-20 pb-20 px-6 max-w-6xl mx-auto text-center">
      {/* --- REFINED DOWNLOAD BOX --- */}
      <div className="relative group inline-block w-full max-w-4xl mx-auto">
        <div className="absolute -inset-1 bg-blue-600/5 rounded-[32px] blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000" />
        <div className="relative bg-[#09090B]/60 border border-white/5 backdrop-blur-xl rounded-[32px] p-10 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Get the <span className="text-blue-500">Eidos Beta</span>
          </h2>

          <p className="mt-4 text-white/40 text-[15px] max-w-md font-normal leading-relaxed">
            Download the official Eidos extension pack. Once downloaded, follow
            our 3-step setup guide to start analyzing.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {/* ✅ 2. Updated the href and added the 'download' attribute */}
            <a
              href={githubDownloadLink}
              download="eidos-extension.zip" // Forces the browser to download
              className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Download Eidos Pack (.zip)
              <FiDownload />
            </a>
          </div>
        </div>
      </div>

      {/* --- 3-STEP SETUP STEPS --- */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto border-t border-white/5 pt-14">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/10 text-xs font-bold">
            1
          </div>
          <p className="text-white/40 text-[13px] text-center leading-relaxed">
            Unzip the <span className="text-white/60">eidos-extension</span>{" "}
            folder to your Desktop.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/10 text-xs font-bold">
            2
          </div>
          <p className="text-white/40 text-[13px] text-center leading-relaxed">
            Go to{" "}
            <span className="text-blue-500/80 text-[11px] font-mono">
              chrome://extensions
            </span>{" "}
            and enable Developer Mode.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/10 text-xs font-bold">
            3
          </div>
          <p className="text-white/40 text-[13px] text-center leading-relaxed">
            Click <span className="text-white/60">Load Unpacked</span> and
            select the Eidos folder.
          </p>
        </div>
      </div>
    </section>
  );
}
