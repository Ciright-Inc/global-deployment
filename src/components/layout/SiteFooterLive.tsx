"use client";

import { useEffect, useState } from "react";
import { SiteFooterView } from "@/components/layout/SiteFooterView";
import type { SiteFooterConfig } from "@/lib/siteFooter/types";

export const siteFooterClientApiPath = "/api/public/site-footer";

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

/** Footer with SSR data; refreshes from `/api/public/site-footer` in the browser. */
export function SiteFooterLive({ initialData }: { initialData: SiteFooterConfig }) {
  const [config, setConfig] = useState(initialData);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(siteFooterClientApiPath, { cache: "no-store" });
        if (!res.ok || cancelled) return;

        const raw: unknown = await res.json();
        if (!isSiteFooterConfig(raw) || cancelled) return;

        setConfig(raw);
      } catch {
        /* keep SSR initialData */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteFooterView config={config} />;
}
