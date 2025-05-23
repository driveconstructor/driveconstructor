import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: "",
  env: {
    build_at: new Date().toISOString(),
  },
  distDir: "out",
};

const withMDX = createMDX();

export default withMDX(nextConfig);
