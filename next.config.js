/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
}
)
const nextConfig =withBundleAnalyzer(withPWA({
  crossOrigin: 'anonymous', 
  reactStrictMode: true,
   typescript: {
     ignoreBuildErrors: true
   },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}))

module.exports = nextConfig;
