// src/app/api/feedback/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { category, message, rating, name, email } = body;

    // 1. 🛡️ Data Validation
    if (!message || !rating) {
      return NextResponse.json(
        { error: "Rating and Message are required" },
        { status: 400 },
      );
    }

    // 2. 🚀 Forward to Formspree (Email Sync)
    // Replace 'YOUR_FORMSPREE_ID' with the ID from your Formspree dashboard
    const formspreeResponse = await fetch("https://formspree.io/f/xnjorvbq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `New Eidos Beta Feedback: ${category}`,
        rating: `${rating} / 5`,
        category,
        name,
        email,
        message,
      }),
    });

    if (formspreeResponse.ok) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error("Formspree forward failed");
    }
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 },
    );
  }
}
