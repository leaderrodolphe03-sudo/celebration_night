/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      {
        source: "/hagiazo",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/informations",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
