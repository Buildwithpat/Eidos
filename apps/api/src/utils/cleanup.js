// apps/api/src/utils/cleanup.js
const prisma = require("../prisma"); // Adjust this path if your prisma.js is elsewhere
const fs = require("fs");
const path = require("path");

async function cleanProject() {
  try {
    console.log("🧹 Starting Eidos Cleanup...");

    // 1. Get all records from DB
    const records = await prisma.analysis.findMany({
      select: { screenshot: true },
    });

    // 2. Delete the physical images from the /screenshots folder
    records.forEach((record) => {
      if (record.screenshot) {
        // This resolves to apps/api/screenshots/filename.png
        const fullPath = path.resolve(__dirname, "../../", record.screenshot);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`- Deleted: ${record.screenshot}`);
        }
      }
    });

    // 3. Clear the database table
    const result = await prisma.analysis.deleteMany({});
    console.log(`✅ Database cleared. Removed ${result.count} records.`);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

cleanProject();
