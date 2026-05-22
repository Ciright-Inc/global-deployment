import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { GovernmentsAnalyticsScripts } from "@/components/analytics/GovernmentsAnalyticsScripts";
import "./globals.css";
import { KEYRA_LOGO_SRC } from "@/lib/keyraBrandAssets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Keyra — Global Deployment",
    template: "%s | Keyra",
  },
  description:
    "Explore Keyra's published regional, country, and operator deployment posture — calm, structured, and institutionally grounded.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_GLOBAL_DEPLOYMENT_URL?.trim() || "https://governments.keyra.ie",
  ),
  icons: {
    icon: KEYRA_LOGO_SRC,
    shortcut: KEYRA_LOGO_SRC,
    apple: KEYRA_LOGO_SRC,
  },
  openGraph: {
    title: "Keyra — Global Deployment",
    description:
      "Explore Keyra's published regional, country, and operator deployment posture — calm, structured, and institutionally grounded.",
    siteName: "Keyra",
    locale: "en_IE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IE"
      data-keyra-lane="consumer"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
        />
      </head>
      <body className="flex min-h-full min-w-0 flex-col font-sans" suppressHydrationWarning>
        <GovernmentsAnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
