const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 👇 dette løser Turbopack-konflikten med next-pwa
  turbopack: {},
};

module.exports = withPWA(nextConfig);
