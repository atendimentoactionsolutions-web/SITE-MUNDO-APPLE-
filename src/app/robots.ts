import { MetadataRoute } from "next";
import { storeConfig } from "@/data/storeConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${storeConfig.contact.website}/sitemap.xml`,
  };
}
