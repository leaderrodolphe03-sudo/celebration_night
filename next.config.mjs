/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compression active pour Gzip et Brotli
  compress: true,

  // Sécurité : suppression de l'en-tête x-powered-by
  poweredByHeader: false,

  // Optimisation du tree-shaking des paquets volumineux
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Optimisation avancée des images avec Sharp
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // Cache d'1 an pour les images optimisées
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // En-têtes HTTP de sécurité et mise en cache long terme des ressources statiques
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
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
