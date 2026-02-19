/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-62c41549a44642efbcd3f775bdb039b3.r2.dev",
      },
    ],
  },
};

export default nextConfig
