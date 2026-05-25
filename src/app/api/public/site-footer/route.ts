import { NextResponse } from "next/server";
import { loadPublicSiteFooterConfig } from "@/lib/siteFooter/loadPublicSiteFooterConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Published site footer — proxied from keyra.ie CMS (`NEXT_PUBLIC_KEYRA_MARKETING_ORIGIN`). */
export async function GET() {
  const footer = await loadPublicSiteFooterConfig();
  return NextResponse.json(footer, {
    headers: { "Cache-Control": "no-store" },
  });
}
