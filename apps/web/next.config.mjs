/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // ONLY keep this one for Prisma:
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
