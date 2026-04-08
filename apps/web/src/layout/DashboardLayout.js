"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Inspector from "@/components/Inspector";
import Preview from "@/components/Preview";
import BottomPanel from "@/components/BottomPanel";

export default function DashboardLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#05070B]">
      <Sidebar />

      <div className="flex-1 flex flex-col px-6 py-5 gap-4">
        <Topbar />

        <div className="flex flex-1 gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <Preview />
            <BottomPanel />
          </div>

          <Inspector />
        </div>
      </div>
    </div>
  );
}
