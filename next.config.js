/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  },
};

module.exports = nextConfig;