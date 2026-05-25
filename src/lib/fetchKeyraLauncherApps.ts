import { getKeyraAdminAppLinks, keyraLauncherAppsApiUrl, type KeyraEcosystemAppLink } from "@/lib/keyraAppUrls";

export type KeyraLauncherApp = KeyraEcosystemAppLink;

/** Same source as keyra.ie 9-dot: public launcher API, then admin seed fallback. */
export async function fetchKeyraLauncherApps(): Promise<KeyraLauncherApp[]> {
  try {
    const res = await fetch(`${keyraLauncherAppsApiUrl()}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return getKeyraAdminAppLinks();
    const data = (await res.json()) as { apps?: KeyraLauncherApp[] };
    if (Array.isArray(data?.apps) && data.apps.length > 0) return data.apps;
    return getKeyraAdminAppLinks();
  } catch {
    return getKeyraAdminAppLinks();
  }
}
