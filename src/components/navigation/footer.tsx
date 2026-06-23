import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { DynamicMenu } from "@/lib/server/menus";
import { SiteSettings } from "@/lib/shared/types";

import {
  BookOpen,
  GraduationCap,
  Users,
  Mail,
  Menu,
  ExternalLink,
  MapPin,
} from "lucide-react";

// Native dictionary matching string names to explicit imports safely
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  BookOpen,
  GraduationCap,
  Users,
  Mail,
  Menu,
  MapPin,
};

interface FooterProps {
  initialMenus?: DynamicMenu[];
  currentSettings?: Partial<SiteSettings> | null;
}

export function Footer({ initialMenus = [], currentSettings }: FooterProps) {
  // Filter active database menus that have valid child link arrays and are marked for footer visibility
  const activeFooterMenus = initialMenus.filter(
    (menu) =>
      menu.isActive && menu.showInFooter && menu.items && menu.items.length > 0,
  );

  return (
    <footer className="bg-blue-600 text-white border-t border-perfectsky-200/50 dark:border-perfectsky-800/40 py-16 px-4 antialiased">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Logo, Identity & Address Segment */}
          <BrandSegment currentSettings={currentSettings} />

          {/* Dynamic or Static Navigation Columns */}
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
                      external: item.isOpenNewTab,
                      iconName: item.icon ?? "",
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
                    iconName={
                      (section as Record<string, any>)["icon"] ?? "Menu"
                    }
                    links={section.links.map((link) => ({
                      id: `${section.title}-${link.href}`,
                      label: link.title,
                      href: link.href,
                      external: false,
                      iconName: (link as Record<string, any>)["icon"] ?? "",
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

/**
 * Dynamic Icon Renderer Component
 * Looks up string names inside our explicit mapped list safely with a fallback state
 */
function DynamicLucideIcon({
  name,
  className = "w-4 h-4",
}: {
  name?: string;
  className?: string;
}) {
  if (!name || name.trim() === "") return null;

  const IconComponent = LucideIconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
}

/**
 * Sub-Component: Identity and Brand Information
 */
function BrandSegment({ currentSettings }: { currentSettings?: Partial<SiteSettings> | null | undefined }) {

  const currentYear = new Date().getFullYear();
  
  const activeSiteName = currentSettings?.siteName || siteConfig.siteName;
  const activeDescription = currentSettings?.description || siteConfig.description || "Unified Dashboard Management Engine.";
  const activeLogoUrl = currentSettings?.logoUrl || "/phaglp-logo.webp";
  const activeAddress = currentSettings?.fullAddress || "2501 CASE STREET, BATESVILLE 72501, ARKANSAS, USA ";

  return (
    <div className="lg:col-span-4 space-y-5">
      <div className="flex items-center gap-2">
        <Image
          src={activeLogoUrl}
          alt={`${activeSiteName} Logo`}
          width={128}
          height={128}
          className="h-9 w-auto object-contain transition-all"
          priority
          unoptimized
        />
        <span className="text-xl font-bold tracking-tight text-white">
          {activeSiteName}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
        {activeDescription}
      </p>

      {/* Corporate Location Address Block */}
      {activeAddress && (
        <div className="flex items-start gap-2 text-sm text-gray-400 max-w-sm pt-2 border-t border-white/10">
          <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{activeAddress}</span>
        </div>
      )}

      <div className="text-xs text-gray-400 pt-1">
        &copy; {currentYear} {activeSiteName}. All rights reserved.
      </div>
    </div>
  );
}

/**
 * Sub-Component: Individual Link Column
 */
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
          name={iconName ?? ""}
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
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 group w-fit"
            >
              <DynamicLucideIcon
                name={link.iconName ?? ""}
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
