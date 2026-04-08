import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force Dynamic ensures Next.js doesn't cache the feedback list
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch all feedback, newest first
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
            plan: true,
          },
        },
      },
    });

    // Return the list to your Admin Dashboard
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 },
    );
  }
}
