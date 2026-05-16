import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="bg-accent text-slate-900 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/phaglp-logo.png"
                alt="PHAGLP Logo"
                width={128}
                height={128}
                className="h-8 w-auto object-contain brightness-0"
              />
              <span className="text-xl font-bold text-slate-900">{siteConfig.siteName}</span>
            </div>
            <p className="text-slate-900/80">{siteConfig.description}</p>
          </div>
          {siteConfig.footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-slate-900">{section.title}</h3>
              <ul className="flex flex-col gap-2 text-slate-900/80">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-slate-900 transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-900/10 mt-8 pt-8 text-center text-slate-900/80">
          <p>{`© ${new Date().getFullYear()} ${siteConfig.siteName}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}
