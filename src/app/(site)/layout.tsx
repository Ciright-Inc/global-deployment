import { ElevenLabsHomeAgent } from "@/components/home/ElevenLabsHomeAgent";
import { HeaderNoSSR } from "@/components/layout/HeaderNoSSR";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { KeyraSessionProvider } from "@/contexts/KeyraSessionContext";

export const dynamic = "force-dynamic";

export default function SiteShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <KeyraSessionProvider initialUser={null}>
      <HeaderNoSSR />
      <div
        className="pointer-events-none shrink-0"
        style={{ height: "var(--keyra-header-offset)" }}
        aria-hidden
      />
      <main className="min-w-0 flex-1">{children}</main>
      <ElevenLabsHomeAgent />
      <SiteFooter />
    </KeyraSessionProvider>
  );
}
