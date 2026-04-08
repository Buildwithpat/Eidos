"use client";
import { FiDownload } from "react-icons/fi";

export default function AssetItem({ asset }) {
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const link = document.createElement("a");

      if (asset.type === "icons" && asset.content) {
        // ✅ Convert raw SVG code into a virtual file
        const blob = new Blob([asset.content], { type: "image/svg+xml" });
        link.href = URL.createObjectURL(blob);
        link.download = asset.name || "icon.svg";
      } else if (asset.url) {
        // ✅ Standard image download
        link.href = asset.url;
        link.download = asset.name || "image.png";
        link.target = "_blank";
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the virtual URL memory
      if (asset.type === "icons") {
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div
      onClick={handleDownload}
      className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-blue-500/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Simple Icon Placeholder */}
        <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
        <span className="text-white/50 text-[11px] truncate font-normal group-hover:text-white transition-colors">
          {asset.name}
        </span>
      </div>
      <FiDownload
        className="text-white/20 group-hover:text-blue-500 transition-colors"
        size={14}
      />
    </div>
  );
}
