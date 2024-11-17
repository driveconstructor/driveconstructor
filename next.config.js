/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/driveconstructor",
  env: {
    build_at: new Date().toISOString(),
  },
  distDir: "out/driveconstructor",
};

module.exports = nextConfig;
