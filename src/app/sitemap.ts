import { MetadataRoute } from "next";
import { products } from "@/data/products";
import { storeConfig } from "@/data/storeConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = storeConfig.contact.website;

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/produtos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    "",
    "/produtos",
    "/iphone",
    "/mac",
    "/ipad",
    "/apple-watch",
    "/seminovos",
    "/troca",
    "/servicos",
    "/sobre",
    "/contato",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...staticUrls, ...productUrls];
}
