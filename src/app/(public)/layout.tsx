import { getSiteSettings } from "@/lib/server/site-settings";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";

// We do not need fonts, metadata, or scripts here because the Root Layout handles them.
// This layout strictly wraps public pages with the Navbar and Footer.

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the dynamic settings to pass to your Navbar and Footer
  const siteConfig = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Inject the Navbar at the top */}
      <Navbar currentSettings={siteConfig} initialMenus={[]} />
      
      {/* 2. The page content goes here, expanding to fill the middle space */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* 3. Inject the Footer at the bottom */}
      <Footer currentSettings={siteConfig} initialMenus={[]} />
    </div>
  );
}
