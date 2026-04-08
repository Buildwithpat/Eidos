import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Fetch the actual website HTML
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch target");

    // 2. For now, let's return a success message
    // (Later we can add actual scraping logic here)
    const mockResult = [
      {
        id: "1",
        domain: new URL(targetUrl).hostname,
        url: targetUrl,
        type: "success",
        text: "Connection established with " + new URL(targetUrl).hostname,
        data: { status: "Online" },
      },
    ];

    return NextResponse.json(mockResult);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
