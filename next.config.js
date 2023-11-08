/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.CI ? "/driveconstructor" : "",
};

module.exports = nextConfig;
