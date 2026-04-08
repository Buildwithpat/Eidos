import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userId = "user_default_id";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        analysisCount: true,
        plan: true,
      },
    });

    // ✅ Fix: If user is null, return default stats instead of crashing
    if (!user) {
      return NextResponse.json({
        analysisCount: 0,
        plan: "free",
        message: "Default user not found, using fallback stats",
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
