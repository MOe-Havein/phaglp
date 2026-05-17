import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { DynamicMenu } from "@/lib/server/menus"
import { ExternalLink } from "lucide-react"

interface FooterProps {
  initialMenus?: DynamicMenu[]
}

export function Footer({ initialMenus = [] }: FooterProps) {
  // Select active menus that actually contain sub-menu items to render as footer sections
  const activeFooterMenus = initialMenus.filter(
    (menu) => menu.isActive && menu.items && menu.items.length > 0
  )

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 text-foreground py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Logo & Platform Info Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/phaglp-logo.png"
                alt="PHAGLP Logo"
                width={128}
                height={128}
                className="h-9 w-auto object-contain dark:brightness-100 transition-all"
              />
              <span className="text-xl font-bold tracking-tight text-primary dark:text-blue-400">
                {siteConfig.siteName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {siteConfig.description || "Bridging classical philosophical teachings with state-of-the-art cognitive training and learning technologies."}
            </p>
            <div className="text-xs text-muted-foreground pt-2">
              {`© ${new Date().getFullYear()} ${siteConfig.siteName}. All rights reserved.`}
            </div>
          </div>

          {/* Dynamic Footer Link Columns */}
          {activeFooterMenus.length > 0 ? (
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {activeFooterMenus.map((menu) => (
                <div key={menu.id} className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase text-foreground/80">
                    {menu.name}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {menu.items.map((subItem) => (
                      <li key={subItem.id}>
                        <Link
                          href={subItem.href}
                          target={subItem.isOpenNewTab ? "_blank" : undefined}
                          rel={subItem.isOpenNewTab ? "noopener noreferrer" : undefined}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 w-fit"
                        >
                          {subItem.name}
                          {subItem.isOpenNewTab && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            /* Static Fallback Footer Columns */
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {siteConfig.footerLinks.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase text-foreground/80">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
