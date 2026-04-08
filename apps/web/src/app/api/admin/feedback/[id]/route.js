import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.feedback.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 },
    );
  }
}
