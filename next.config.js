const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
