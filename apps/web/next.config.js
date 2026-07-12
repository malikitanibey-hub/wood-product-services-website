/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    webpackBuildWorker: false,
  },

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination:
          "https://wood-product-services-website.onrender.com/api/:path*",
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }

    return config;
  },
};

module.exports = nextConfig;