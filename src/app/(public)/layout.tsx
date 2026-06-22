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
  
  // Use specialized SEO meta values if present; fallback gracefully to general definitions
  const titleText = siteConfig.metaTitle || siteConfig.siteName;
  const descriptionText = siteConfig.metaDescription || siteConfig.description;
  const baseMetadataUrl = siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : null;

  return {
    title: {
      default: titleText,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: descriptionText,
    keywords: ["Next.js", "React", "Full-stack", "Modern", siteConfig.siteName],
    authors: [{ name: "MOe Hamid" }],
    creator: "MOe Hamid",
    ...(baseMetadataUrl && { metadataBase: baseMetadataUrl }),
    
    // Wire dynamic brand icons natively into Next.js Metadata API
    icons: {
      icon: siteConfig.faviconUrl || "/favicon.ico",
      apple: siteConfig.logoUrl || "/apple-icon.png",
    },
    
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.siteUrl,
      title: titleText,
      description: descriptionText,
      siteName: siteConfig.siteName,
      images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      creator: "@yourhandle",
      images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
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
  
  // Clean fallback mapping for JSON-LD schema metrics
  const displayLogo = siteConfig.logoUrl || `${siteConfig.siteUrl}/logo.png`;

  return {
    title: {
      default: titleText,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: descriptionText,
    keywords: ["Next.js", "React", "Full-stack", "Modern", siteConfig.siteName],
    authors: [{ name: "MOe Hamid" }],
    creator: "MOe Hamid",
    ...(baseMetadataUrl && { metadataBase: baseMetadataUrl }),
    
    // Wire dynamic brand icons natively into Next.js Metadata API
    icons: {
      icon: siteConfig.faviconUrl || "/favicon.ico",
      apple: siteConfig.logoUrl || "/apple-icon.png",
    },
    
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.siteUrl,
      title: titleText,
      description: descriptionText,
      siteName: siteConfig.siteName,
      images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      creator: "@yourhandle",
      images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
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
  
  // Clean fallback mapping for JSON-LD schema metrics
  const displayLogo = siteConfig.logoUrl || `${siteConfig.siteUrl}/logo.png`;

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

        {/* Dynamic Schema.org Structural Profile Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.siteName,
              url: siteConfig.siteUrl,
              logo: displayLogo,
              // Seamlessly append dynamic location details for local search indexers if set
              ...(siteConfig.fullAddress && {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: siteConfig.fullAddress,
                },
              }),
            }),
          }}
        />
      </body>
    </html>
  );
}
