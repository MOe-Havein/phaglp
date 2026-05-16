import { SiteSettings } from "@/lib/shared/types"

export const siteConfig: SiteSettings = {
  siteName: "Phaglp",
  description: "A modern application for philosophical education.",
  siteUrl: "https://phaglp.com",
  maintenanceMode: false,
  enableGoogleAnalytics: false,
  navItems: [
    { title: "Courses", href: "/courses" },
    { title: "Lectures", href: "/lectures" },
    { title: "Pricing", href: "/pricing" },
  ],
  footerLinks: [
    {
      title: "Product",
      links: [
        { title: "Features", href: "/features" },
        { title: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [{ title: "Contact", href: "/contact" }],
    },
    {
      title: "Legal",
      links: [
        { title: "Privacy", href: "/privacy" },
        { title: "Terms", href: "/terms" },
        { title: "Policy", href: "/policy" },
      ],
    },
  ],
}
