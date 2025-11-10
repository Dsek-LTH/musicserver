/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  reactStrictMode: false
}

module.exports = nextConfig
