/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // garante compatibilidade com page.tsx e layout.tsx
  },
};

module.exports = nextConfig;
