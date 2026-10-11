import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://celebrationnight.org";

  const routes = [
    "",
    "/about",
    "/programme",
    "/artistes",
    "/medias",
    "/echo-de-la-louange",
    "/contact",
    "/inscription",
    "/mon-billet",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/inscription" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/inscription" ? 0.9 : 0.8,
  }));
}
