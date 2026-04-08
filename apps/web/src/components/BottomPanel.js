"use client";
export default function BottomPanel({ selectedElement }) {
  if (!selectedElement)
    return <div className="p-8 text-white/10">Select an element</div>;

  const Property = ({ label, value }) => {
    // ✅ Hide the row if there is no value
    if (!value || value === "null" || value === "rgba(0, 0, 0, 0)") return null;

    return (
      <div className="flex justify-between items-center py-3 border-b border-white/[0.03]">
        <span className="text-white/30 text-[11px] font-medium">{label}</span>
        <span className="text-white font-mono text-[11px]">{value}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scroll">
      <div className="mb-8">
        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase mb-2 inline-block">
          {selectedElement.tag}
        </span>
        <h2 className="text-white text-xl font-bold">Detailed Specs</h2>
      </div>

      {/* Only show Typography section if fontFamily exists */}
      {selectedElement.fontFamily && (
        <div className="space-y-1 mb-10">
          <h4 className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-4">
            Typography
          </h4>
          <Property label="Font Family" value={selectedElement.fontFamily} />
          <Property label="Font Size" value={selectedElement.fontSize} />
          <Property label="Text Color" value={selectedElement.color} />
        </div>
      )}

      <div className="space-y-1">
        <h4 className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-4">
          Appearance & Layout
        </h4>
        <Property label="Background" value={selectedElement.backgroundColor} />
        <Property label="Padding" value={selectedElement.padding} />
        <Property label="Border Radius" value={selectedElement.borderRadius} />
        <Property
          label="Width"
          value={`${Math.round(selectedElement.width)}px`}
        />
        <Property
          label="Height"
          value={`${Math.round(selectedElement.height)}px`}
        />
      </div>
    </div>
  );
}
