import { SiteFooterLive } from "@/components/layout/SiteFooterLive";
import { loadPublicSiteFooterConfig } from "@/lib/siteFooter/loadPublicSiteFooterConfig";

export async function SiteFooter() {
  const config = await loadPublicSiteFooterConfig();
  return <SiteFooterLive initialData={config} />;
}
