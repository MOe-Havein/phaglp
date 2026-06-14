import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  Mail,
  Menu,
  ExternalLink,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import type { DynamicMenu } from "@/lib/server/menus";

interface FooterProps {
  initialMenus?: DynamicMenu[];
}

/**
 * Curated icon registry.
 * Only include icons actually used by menus.
 */
const ICON_MAP = {
  BookOpen,
  GraduationCap,
  Users,
  Mail,
  Menu,
} satisfies Record<string, ComponentType<any>>;

type IconName = keyof typeof ICON_MAP;

export function Footer({ initialMenus = [] }: FooterProps) {
  const activeFooterMenus = initialMenus.filter(
    (menu) =>
      menu.isActive &&
      menu.showInFooter &&
      Array.isArray(menu.items) &&
      menu.items.length > 0
  );

  return (
    <footer className="bg-[#0F1D45] text-white border-t border-perfectsky-200/50 dark:border-perfectsky-800/40 py-16 px-4 antialiased">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <BrandSegment />

          <div className="lg:col-span-8">
  {activeFooterMenus.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {activeFooterMenus.map((menu) => (
        <MenuColumn
          key={menu.id}
          title={menu.name}
          iconName={menu.icon ?? "Menu"}
          links={menu.items.map((item) => ({
            id: item.id,
            label: item.name,
            href: item.href,
            external: false, 
            // FIX: Fallback to an absolute empty string instead of undefined
            // This satisfies exactOptionalPropertyTypes cleanly
            iconName: "", 
          }))} 
        />
      ))}
    </div>
  ) : (

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {siteConfig.footerLinks.map((section) => (
                  <MenuColumn
                    key={section.title}
                    title={section.title}
                    iconName={section.icon ?? "Menu"}
                    links={section.links.map((link) => ({
                      id: `${section.title}-${link.href}`,
                      label: link.title,
                      href: link.href,
                      external: isExternalUrl(link.href),
                      iconName: "",
                    }))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function DynamicLucideIcon({
  name,
  className = "w-4 h-4",
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return null;

  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) {
    return <Menu className={className} />;
  }

  return <IconComponent className={className} />;
}

function BrandSegment() {
  const currentYear = new Date().getFullYear();

  const defaultDescription =
    "Bridging classical philosophical teachings with state-of-the-art cognitive training and learning technologies.";

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center gap-2">
        <Image
          src="/phaglp-logo.png"
          alt={`${siteConfig.siteName} Logo`}
          width={128}
          height={128}
          className="h-9 w-auto object-contain"
        />

        <span className="text-xl font-bold tracking-tight text-blue-400">
          {siteConfig.siteName}
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
        {siteConfig.description || defaultDescription}
      </p>

      <div className="text-xs text-gray-400 pt-2">
        © {currentYear} {siteConfig.siteName}. All rights reserved.
      </div>
    </div>
  );
}

interface LinkItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  iconName?: string;
}

function MenuColumn({
  title,
  iconName,
  links,
}: {
  title: string;
  iconName?: string;
  links: LinkItem[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold tracking-wider uppercase text-gray-200 flex items-center gap-2">
        <DynamicLucideIcon
          name={iconName}
          className="w-4 h-4 text-blue-400"
        />
        {title}
      </h3>

      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={
                link.external
                  ? `${link.label} (opens in new tab)`
                  : link.label
              }
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 group w-fit"
            >
              <DynamicLucideIcon
                name={link.iconName}
                className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors"
              />

              <span className="group-hover:underline underline-offset-4">
                {link.label}
              </span>

              {link.external && (
                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
