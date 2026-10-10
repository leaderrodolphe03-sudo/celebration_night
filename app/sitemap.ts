import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/a-propos",
  "/intervenants",
  "/programme",
  "/galerie",
  "/archives",
  "/partenaires",
  "/inscription",
  "/contact",
  "/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" || route === "/inscription" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/inscription" ? 0.9 : 0.7,
  }));
}
