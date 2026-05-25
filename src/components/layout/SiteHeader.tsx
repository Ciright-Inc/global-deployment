"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AccountMenu } from "./AccountMenu";
import { KeyraAppLauncher } from "./KeyraAppLauncher";
import { MobileNav } from "./MobileNav";
import { KeyraLogo } from "@/components/brand/KeyraLogo";
import { useKeyraSession } from "@/contexts/KeyraSessionContext";
import {
  buildGetStartedAccessUrl,
  keyraDeveloperPortalUrl,
  keyraMarketingOrigin,
} from "@/lib/keyraAppUrls";
import { globalDeploymentOrigin } from "@/lib/site-branding";

type NavItem = { href: string; label: string; external?: boolean };

function buildNav(marketing: string): NavItem[] {
  return [
    { href: `${marketing}/#problem`, label: "Why identity", external: true },
    { href: `${marketing}/#missing-layer`, label: "The shift", external: true },
    { href: `${marketing}/#for`, label: "Who it's for", external: true },
    { href: `${marketing}/#global`, label: "Global", external: true },
    { href: keyraDeveloperPortalUrl(), label: "Developers", external: true },
  ];
}

export function SiteHeader() {
  const { user } = useKeyraSession();
  const pathname = usePathname();
  const marketing = keyraMarketingOrigin();
  const nav = useMemo(() => buildNav(marketing), [marketing]);

  const accessHref = useMemo(() => {
    if (typeof window !== "undefined") {
      return buildGetStartedAccessUrl(
        `${globalDeploymentOrigin()}${pathname}${window.location.search || ""}`,
      );
    }
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return buildGetStartedAccessUrl(`${globalDeploymentOrigin()}${path}`);
  }, [pathname]);

  return (
    <header className="keyra-site-header-shell z-[var(--keyra-z-header)] w-full shrink-0">
      <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-y-0 px-3 py-0.5 sm:px-6 lg:h-14 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] lg:items-center lg:gap-x-0 lg:gap-y-0 lg:py-0">
        <Link
          href={marketing}
          prefetch={false}
          className="relative z-0 flex w-full min-w-0 items-center justify-start overflow-visible py-0 lg:col-start-1 lg:row-start-1 lg:h-14 lg:w-auto lg:max-w-none lg:py-0 lg:pr-3"
          aria-label="Keyra home"
        >
          <KeyraLogo variant="header" showWordmark={false} />
        </Link>

        <nav
          className="relative hidden min-h-0 min-w-0 lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:justify-end lg:mr-0"
          aria-label="Primary"
          style={{ lineHeight: "1.5" }}
        >
          <div className="flex max-w-full flex-nowrap items-center justify-center gap-2 overflow-visible whitespace-nowrap px-2">
            {nav.map((item) => {
              const linkClass =
                "relative inline-flex items-center justify-center whitespace-nowrap rounded-[9999px] px-4 py-2 text-sm font-medium leading-relaxed text-keyra-primary/90 transition-colors duration-150 ease-out active:bg-black/[0.06] hover:bg-black/[0.03]";
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="relative z-10 flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-x-1 gap-y-1 overflow-visible py-0.5 lg:col-start-3 lg:row-start-1 lg:w-auto lg:flex-nowrap lg:justify-end lg:gap-0 lg:py-0.5 lg:pl-0 xl:gap-0 xl:pl-0">
          <MobileNav />
          <AccountMenu />

          {!user ? (
            <div
              className="flex min-w-0 shrink-0 flex-row flex-wrap items-stretch rounded-[var(--keyra-radius-pill)] border border-keyra-border bg-keyra-surface/90 p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md sm:flex-nowrap sm:p-0 mr-1.5 sm:mr-2"
              aria-label="Access Get Started"
            >
              <a
                href={accessHref}
                className="flex shrink-0 items-center whitespace-nowrap rounded-full bg-keyra-accent px-4 py-1.5 text-xs font-semibold leading-none text-white transition-colors duration-150 ease-out active:bg-keyra-accent/80 hover:bg-keyra-accent/90 sm:px-5 sm:text-sm"
              >
                Access
              </a>
            </div>
          ) : null}

          <KeyraAppLauncher />
        </div>
      </div>
    </header>
  );
}
