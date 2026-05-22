import Script from "next/script";
import { headers } from "next/headers";

/** Nexa People / Ciright analytics — governments.keyra.ie only. */
const GOVERNMENTS_ANALYTICS_DOMAIN = "governments.keyra.ie";
const ANALYTICS_SCRIPT_SRC = "https://analytics.ciright.com/js/script.js";
const ANALYTICS_API = "https://analytics.ciright.com/api/event";

function hostnameFromHostHeader(hostHeader: string | null): string {
  if (!hostHeader) return "";
  return hostHeader.split(":")[0]!.toLowerCase();
}

function shouldLoadGovernmentsAnalytics(hostHeader: string | null): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return hostnameFromHostHeader(hostHeader) === GOVERNMENTS_ANALYTICS_DOMAIN;
}

/**
 * Nexa People analytics for global deployment (governments.keyra.ie only).
 * Paste-equivalent of the Ciright hosted script; omitted on localhost and other hosts.
 */
export async function GovernmentsAnalyticsScripts() {
  const hdrs = await headers();
  if (!shouldLoadGovernmentsAnalytics(hdrs.get("host"))) {
    return null;
  }

  return (
    <Script
      src={ANALYTICS_SCRIPT_SRC}
      data-domain={GOVERNMENTS_ANALYTICS_DOMAIN}
      data-api={ANALYTICS_API}
      defer
      strategy="afterInteractive"
    />
  );
}
