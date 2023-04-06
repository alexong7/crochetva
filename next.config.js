/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "i.pinimg.com",
      "e7.pngegg.com",
      "i.postimg.cc",
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
      "www.clipartmax.com",
    ],
  },
};

module.exports = nextConfig;

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})