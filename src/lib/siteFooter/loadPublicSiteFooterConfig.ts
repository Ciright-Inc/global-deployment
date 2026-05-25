import { keyraMarketingPublicOrigin } from "@/lib/keyraAppUrls";
import { getDefaultSiteFooterConfig } from "./defaults";
import { resolveSiteFooterConfig } from "./resolveConfig";
import type { SiteFooterConfig } from "./types";

function isSiteFooterConfig(value: unknown): value is SiteFooterConfig {
  if (!value || typeof value !== "object") return false;
  const payload = value as SiteFooterConfig;
  return (
    Boolean(payload.settings) &&
    Array.isArray(payload.onThisSiteLinks) &&
    Array.isArray(payload.keyraAppLinks) &&
    Array.isArray(payload.socialLinks)
  );
}

/** Loads published footer from keyra.ie CMS API, with local defaults as fallback. */
export async function loadPublicSiteFooterConfig(): Promise<SiteFooterConfig> {
  const cmsOrigin = keyraMarketingPublicOrigin();

  try {
    const res = await fetch(`${cmsOrigin}/api/public/site-footer`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data: unknown = await res.json();
      if (isSiteFooterConfig(data)) {
        return resolveSiteFooterConfig(data, cmsOrigin);
      }
    }
  } catch {
    /* use defaults */
  }

  return resolveSiteFooterConfig(getDefaultSiteFooterConfig(), cmsOrigin);
}
