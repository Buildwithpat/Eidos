import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// 📂 GET: Fetches the last 10 audits for the Sidebar
export async function GET() {
  try {
    const userId = "user_default_id"; // Placeholder for Auth ID

    const recent = await prisma.analysis.findMany({
      where: {
        userId: userId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recent);
  } catch (error) {
    console.error("Database GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}

// 📂 POST: Saves or Updates an Analysis
export async function POST(req) {
  try {
    const body = await req.json();
    const { domain, url, data, title } = body;
    const userId = "user_default_id";

    if (!domain || !url) {
      return NextResponse.json(
        { error: "Missing Domain or URL" },
        { status: 400 },
      );
    }

    // ✅ UPSERT LOGIC
    // This updates existing analysis for the same URL or creates a new one
    const entry = await prisma.analysis.upsert({
      where: {
        url: url,
      },
      update: {
        data: data,
        title: title || null,
        createdAt: new Date(),
      },
      create: {
        domain: domain || "unknown.com",
        url: url,
        title: title || null,
        status: "completed",
        data: data,
        // Linking to the User record via the userId
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Database POST Error:", error);
    return NextResponse.json(
      { error: "Failed to save analysis" },
      { status: 500 },
    );
  }
}

// 📂 DELETE: Removes an entry
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Analysis ID required" },
        { status: 400 },
      );
    }

    await prisma.analysis.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 },
    );
  }
}
