/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;