import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hagdaqlnwpvasnkxwygz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
