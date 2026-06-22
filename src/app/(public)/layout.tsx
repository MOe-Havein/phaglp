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

// Revalidate layout every hour
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
  
  // Use specialized SEO meta values if present; fallback gracefully to general definitions[span_0](start_span)[span_0](end_span)
  const titleText = siteConfig.metaTitle || siteConfig.siteName;[span_1](start_span)[span_1](end_span)
  const descriptionText = siteConfig.metaDescription || siteConfig.description;[span_2](start_span)[span_2](end_span)
  const baseMetadataUrl = siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : null;[span_3](start_span)[span_3](end_span)

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
    
    // Wire dynamic brand icons natively into Next.js Metadata API[span_4](start_span)[span_4](end_span)
    icons: {
      icon: siteConfig.faviconUrl || "/favicon.ico",[span_5](start_span)[span_5](end_span)
      apple: siteConfig.logoUrl || "/apple-icon.png",[span_6](start_span)[span_6](end_span)
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
      creator: "@moaljaaly",
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
  
  // Clean fallback mapping for JSON-LD schema metrics[span_7](start_span)[span_7](end_span)
  const displayLogo = siteConfig.logoUrl || `${siteConfig.siteUrl}/logo.png`;[span_8](start_span)[span_8](end_span)

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LayoutClient>{children}</LayoutClient>
        
        {/* Google Analytics Injection[span_9](start_span)[span_9](end_span) */}
        {siteConfig.enableGoogleAnalytics && siteConfig.googleAnalyticsId && ([span_10](start_span)[span_10](end_span)
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

        {/* Dynamic Schema.org Structural Profile Markup[span_11](start_span)[span_11](end_span) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.siteName,
              url: siteConfig.siteUrl,
              logo: displayLogo,
              // Seamlessly append dynamic location details for local search indexers if set[span_12](start_span)[span_12](end_span)
              ...(siteConfig.fullAddress && {[span_13](start_span)[span_13](end_span)
                address: {
                  "@type": "PostalAddress",
                  streetAddress: siteConfig.fullAddress,[span_14](start_span)[span_14](end_span)
                },
              }),
            }),
          }}
        />
      </body>
    </html>
  );
}
