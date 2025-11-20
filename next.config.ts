import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "deavsbqjdt.ufs.sh",
      },
    ],
    // Nếu bạn không dùng quality=100 thì không cần dòng dưới
    qualities: [100],
  },
};

export default nextConfig;
