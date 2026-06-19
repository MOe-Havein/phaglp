import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/server/site-settings";
import LayoutClient from "./layout-client";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Revalidate root layout every hour
export const revalidate = 3600;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteSettings();
  return {
    title: {
      default: siteConfig.siteName,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: siteConfig.description,
    keywords: ["Next.js", "React", "Full-stack", "Modern", siteConfig.siteName],
    authors: [{ name: "MOe Hamid" }],
    creator: "MOe Hamid",
    metadataBase: new URL(siteConfig.siteUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.siteUrl,
      title: siteConfig.siteName,
      description: siteConfig.description,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.siteName,
      description: siteConfig.description,
      creator: "@yourhandle",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteSettings();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
    <LayoutClient>{children}</LayoutClient>
    {/* Google Analytics Injection */}
    {siteConfig.enableGoogleAnalytics && siteConfig.googleAnalyticsId && (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteConfig.googleAnalyticsId}');
          `}
        </Script>
      </>
    )}

    {/* JSON-LD Structured Data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.siteName,
          url: siteConfig.siteUrl,
          logo: `${siteConfig.siteUrl}/logo.png`,
        }),
      }}
    />
  </body>
    </html>
  );
}
