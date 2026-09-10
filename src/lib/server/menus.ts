import "server-only";
import { prisma } from "@/lib/prisma";
import { cached } from "./cache";
import { siteConfig } from "@/config/site";

export interface DynamicSubItem {
  id: string;
  name: string;
  href: string;
  order: number;
  isOpenNewTab: boolean;
  isActive: boolean;
  icon: string | null;
  iconName?: string | null;
}

export interface DynamicMenu {
  id: string;
  name: string;
  href: string | null;
  order: number;
  isOpenNewTab: boolean;
  isActive: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  icon: string | null;
  items: DynamicSubItem[];
}

export async function getNavigationMenus(): Promise<DynamicMenu[]> {
  return cached<DynamicMenu[]>(
    "site-navigation-menus",
    async () => {
      try {
        const dbMenus = await prisma.navigationMenu.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            items: {
              where: { isActive: true },
              orderBy: { order: "asc" },
            },
          },
        });

        if (!dbMenus || dbMenus.length === 0) {
          // Construct fallback menus based on static siteConfig if DB is empty
          return siteConfig.navItems.map((item, idx) => ({
            id: `fallback-${idx}`,
            name: item.title,
            href: item.href,
            order: idx + 1,
            isOpenNewTab: false,
            isActive: true,
            showInHeader: true,
            showInFooter: true,
            icon: null,
            items: [],
          }));
        }

        return dbMenus as any[] as DynamicMenu[];
      } catch (_error) {
        console.warn(
          "Failed to fetch navigation menus from database, falling back to config.",
        );
        return siteConfig.navItems.map((item, idx) => ({
          id: `fallback-${idx}`,
          name: item.title,
          href: item.href,
          order: idx + 1,
          isOpenNewTab: false,
          isActive: true,
          showInHeader: true,
          showInFooter: true,
          icon: null,
          items: [],
        }));
      }
    },
    {
      tags: ["site-menus", "navigation-menus"],
      revalidate: 3600, // Cache for 1 hour, cleared instantly on admin updates
    },
  );
}
