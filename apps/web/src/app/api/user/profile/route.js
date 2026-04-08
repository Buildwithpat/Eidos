import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: This allows the Topbar to see the user's name and image
export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: "user_default_id" }, // Using your placeholder ID
      select: {
        name: true,
        email: true,
        image: true,
        plan: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// 2. PATCH: This handles the "Save" button from Settings
export async function PATCH(req) {
  try {
    const { name, email, image, accentColor } = await req.json(); // ✅ Added accentColor

    const updatedUser = await prisma.user.update({
      where: { id: "user_default_id" },
      data: {
        name,
        email,
        image,
        accentColor, // ✅ Save to Database
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
