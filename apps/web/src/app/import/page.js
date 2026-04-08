"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ImportHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawData = searchParams.get("data");

    if (rawData) {
      try {
        // 1. Decode and parse the data coming from the Extension
        const decodedData = decodeURIComponent(rawData);
        const parsedData = JSON.parse(decodedData);

        // 2. Save it to localStorage so the main Dashboard (page.js) can pick it up
        localStorage.setItem("latest_import", JSON.stringify(parsedData));

        console.log("✅ Eidos: Data synced successfully");

        // 3. Redirect to the main dashboard
        router.push("/");
      } catch (err) {
        console.error("❌ Eidos: Sync failed", err);
        router.push("/");
      }
    } else {
      // If no data, just go back home
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-black">
        Syncing with Extension...
      </div>
    </div>
  );
}

export default function ImportPage() {
  return (
    <div className="h-screen w-full bg-[#05070B] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-white/10 uppercase tracking-widest text-[10px]">
            Initializing Sync...
          </div>
        }
      >
        <ImportHandler />
      </Suspense>
    </div>
  );
}
