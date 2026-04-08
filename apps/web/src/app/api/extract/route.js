import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { prisma } from "@/lib/prisma"; // Ensure your prisma client is exported from this path

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  // In a real app, get the actual session userId from Clerk/Next-Auth
  // For now, we'll use a placeholder ID
  const userId = "user_default_id";

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. 🛡️ DATABASE GATEKEEPER: Check User & Limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. 🕒 MIDNIGHT RESET LOGIC
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const lastReset = new Date(user.lastResetDate).getTime();

    if (today > lastReset) {
      // New day detected: Reset count to 0 in DB
      await prisma.user.update({
        where: { id: userId },
        data: { analysisCount: 0, lastResetDate: now },
      });
      user.analysisCount = 0;
    }

    // 3. 🚫 BLOCK IF LIMIT REACHED
    if (user.plan === "free" && user.analysisCount >= 3) {
      return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 403 });
    }

    // 4. 📡 EXTRACTION ENGINE
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Colors
    const colorRegex =
      /#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([\d.]+)\)/g;
    const allStyles = $("style").text() + ($("*").attr("style") || "");
    const foundColors = [...new Set(allStyles.match(colorRegex))].filter(
      (c) => c !== null,
    );

    // Extract Fonts
    const fontRegex = /font-family:\s*([^;]+)/g;
    let match;
    const foundFonts = [];
    while ((match = fontRegex.exec(allStyles)) !== null) {
      foundFonts.push(match[1].split(",")[0].replace(/['"]/g, "").trim());
    }

    // Extract Assets
    const images = [];
    $("img").each((i, el) => {
      const src = $(el).attr("src");
      if (src) {
        try {
          images.push(new URL(src, targetUrl).href);
        } catch (e) {
          // Ignore malformed URLs
        }
      }
    });

    // 5. ✅ SUCCESS: Increment Analysis Count in Database
    await prisma.user.update({
      where: { id: userId },
      data: { analysisCount: { increment: 1 } },
    });

    return NextResponse.json({
      colors: foundColors.slice(0, 12),
      fonts: [...new Set(foundFonts)].slice(0, 5),
      assets: images.slice(0, 20),
      domain: new URL(targetUrl).hostname,
      remaining: user.plan === "free" ? 2 - user.analysisCount : "unlimited",
    });
  } catch (error) {
    console.error("Extraction failed:", error);
    return NextResponse.json(
      { error: "Failed to parse site. It may be blocking scrapers." },
      { status: 500 },
    );
  }
}
