import { getSiteSettings } from "@/lib/server/site-settings";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { ThemeInjector } from "@/components/theme/ThemeInjector";
import { getNavigationMenus } from "@/lib/server/menus";

// We do not need fonts, metadata, or scripts here because the Root Layout handles them.
// This layout strictly wraps public pages with the Navbar and Footer.

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the dynamic settings AND the dynamic menus from the server
  const siteConfig = await getSiteSettings();
  const menus = await getNavigationMenus(); // <-- This uses the import!

  return (
    <div className="flex min-h-screen flex-col">
      {/* Inject theme CSS vars from site settings */}
      <ThemeInjector settings={siteConfig} />

      {/* 1. Inject the Navbar at the top and pass the fetched menus */}
      <Navbar currentSettings={siteConfig} initialMenus={menus} />

      {/* 2. The page content goes here, expanding to fill the middle space */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* 3. Inject the Footer at the bottom and pass the fetched menus */}
      <Footer currentSettings={siteConfig} initialMenus={menus} />
    </div>
  );
}
