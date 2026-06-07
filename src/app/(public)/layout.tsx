import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { getNavigationMenus } from "@/lib/server/menus";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menus = await getNavigationMenus();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialMenus={menus} />
      <main className="flex-grow">{children}</main>
      <Footer initialMenus={menus} />
    </div>
  );
}
