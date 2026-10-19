import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: pages ? "export" : undefined,
  basePath: pages ? "/noor-ul-quran" : undefined,
  trailingSlash: pages || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
