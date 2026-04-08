export const dynamic = "force-dynamic"; // 👈 Add this at line 1
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // 1. Check if user exists first to avoid Prisma crash
    const userExists = await prisma.user.findUnique({
      where: { id: "user_default_id" },
    });

    if (!userExists) {
      // If user doesn't exist, we create one so the upload doesn't fail
      await prisma.user.create({
        data: {
          id: "user_default_id",
          email: "aakash@email.com",
          name: "Aakash Pathak",
        },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    // 2. Define path relative to the current file to avoid monorepo path issues
    const publicDir = path.join(process.cwd(), "public");
    const uploadDir = path.join(publicDir, "uploads");

    // 3. Create folder
    await mkdir(uploadDir, { recursive: true });

    // 4. Write file
    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/${filename}`;

    // 5. Update DB
    await prisma.user.update({
      where: { id: "user_default_id" },
      data: { image: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("SERVER CRASH:", error);
    // This ensures we ALWAYS return JSON, preventing the "Unexpected token S" error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
