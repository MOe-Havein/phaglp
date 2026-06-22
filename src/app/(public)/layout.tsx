import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/server/site-settings";
import { Navbar } from "@/components/navigation/navbar"; // Ensure correct import path
import { Footer } from "@/components/navigation/footer"; // Ensure correct import path
import LayoutClient from "@/app/layout-client";
import Script from "next/script";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch live settings and layout menus directly on the server
  const siteConfig = await getSiteSettings();

  return (
    <>
      {/* 1. Pass the settings directly down to the Navbar */}
      <Navbar currentSettings={siteConfig} initialMenus={[]} />
      
      <main className="flex-1">
        <LayoutClient>{children}</LayoutClient>
      </main>
      
      {/* 2. Pass the settings directly down to the Footer */}
      <Footer currentSettings={siteConfig} initialMenus={[]} />

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
    </>
  );
}
