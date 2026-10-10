/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aucune image distante autorisee pour l'instant : un joker "**" ouvre
  // l'optimiseur d'images a n'importe quel domaine (GHSA-9g9p-9gw9-jx7f).
  // Ajouter ici le domaine Supabase Storage une fois le projet cree.
  images: {
    remotePatterns: [],
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
