/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aucune image distante autorisee pour l'instant : un joker "**" ouvre
  // l'optimiseur d'images a n'importe quel domaine (GHSA-9g9p-9gw9-jx7f).
  // Ajouter ici le domaine Supabase Storage une fois le projet cree.
  images: {
    remotePatterns: [],
  },
  // En-tetes de securite appliques a toutes les pages.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Camera autorisee pour le scanner d'entree, rien d'autre.
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/hagiazo", destination: "/a-propos", permanent: true },
      { source: "/informations", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
