import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },

  serverExternalPackages: ["pg", "pg-hstore", "sequelize"],
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-hstore", "sequelize"],
  },
};

export default nextConfig;
