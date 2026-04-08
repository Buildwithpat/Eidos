const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const user = await prisma.user.upsert({
    where: { id: "user_default_id" },
    update: {}, // If it exists, don't change anything
    create: {
      id: "user_default_id",
      email: "default@eidos.com",
      plan: "free",
      analysisCount: 0,
    },
  });

  console.log("✅ Default user created/verified:", user);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
