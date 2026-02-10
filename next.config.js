/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = {
  nextConfig,
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "content-type",
            value: "text/x-component",
          },
        ],
      },
    ];
  },
};
