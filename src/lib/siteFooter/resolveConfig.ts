import type { SiteFooterConfig, SiteFooterLinkView } from "./types";

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveMarketingLink(link: SiteFooterLinkView, marketingOrigin: string): SiteFooterLinkView {
  const href = link.href.trim();
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return link;
  }
  if (href.startsWith("/")) {
    return {
      ...link,
      href: `${trimSlash(marketingOrigin)}${href}`,
      isExternal: true,
      internalPath: null,
    };
  }
  return link;
}

/** Resolve keyra.ie-relative footer links to absolute URLs on this standalone site. */
export function resolveSiteFooterConfig(
  config: SiteFooterConfig,
  marketingOrigin: string,
): SiteFooterConfig {
  return {
    ...config,
    onThisSiteLinks: config.onThisSiteLinks
      .filter((link) => link.isPublished)
      .map((link) => resolveMarketingLink(link, marketingOrigin)),
    keyraAppLinks: config.keyraAppLinks.filter((link) => link.isPublished),
    socialLinks: config.socialLinks.filter((link) => link.isPublished),
  };
}
