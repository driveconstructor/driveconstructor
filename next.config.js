/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "",
  env: {
    build_at: new Date().toISOString(),
  },
  distDir: "out",
};

module.exports = nextConfig;
