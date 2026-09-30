/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      {
        source: "/hagiazo",
        destination: "/notre-histoire",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/notre-histoire",
        permanent: true,
      },
      {
        source: "/informations",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/programme",
        destination: "/notre-histoire",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
