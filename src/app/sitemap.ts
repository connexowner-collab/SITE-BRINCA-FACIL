import type { MetadataRoute } from "next";
import { listarBrinquedos } from "@/lib/dados";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brinquedos = await listarBrinquedos();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    ...brinquedos.map((b) => ({
      url: `${SITE_URL}/brinquedos/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
