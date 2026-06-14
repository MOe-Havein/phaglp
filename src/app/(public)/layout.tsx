import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer"; 
import { getNavigationMenus } from "@/lib/server/menus";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Parallel data fetching on the Vercel server layer for zero client-side lag
  const menus = await getNavigationMenus();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Dynamic Navbar Layer */}
      <Navbar initialMenus={menus} />
      
      {/* Core Main Viewport Children */}
      <main className="flex-grow">{children}</main>
      
      {/* Refactored Dynamic Footer: Maps Lucide icon strings from database automatically */}
      <Footer initialMenus={menus} />
    </div>
  );
}
