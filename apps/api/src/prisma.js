require("dotenv").config(); // 🔥 IMPORTANT

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;