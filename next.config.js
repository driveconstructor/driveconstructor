/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.CI ? "/driveconstructor" : "",
  env: {
    build_at: new Date().toISOString(),
  },
};

module.exports = nextConfig;
