/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-62c41549a44642efbcd3f775bdb039b3.r2.dev",
      },
      {
        protocol: "https",
        hostname: "d32dm0rphc51dk.cloudfront.net",
      },
    ],
  },
};

export default nextConfig
