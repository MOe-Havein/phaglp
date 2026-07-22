import { SiteSettings } from "@/lib/shared/types";

export const siteConfig: SiteSettings = {
  id: "global",
  siteName: "",
  siteUrl: "https://www.phaglp.com",
  metaTitle: "The Philosophical Academy Platform | phaglp",
  metaDescription: "High-performance app architecture.",
  description: "Unified Dashboard Management Engine.",
  primaryColor: "#3b82f6",
  secondaryColor: "#565e71",
  backgroundColor: "#f8f9ff",
  textColor: "#181c22",
  ogImage: "",
  logoUrl: "/phaglp-logo.webp",
  faviconUrl: "",
  googleAnalyticsId: null,
  enableGoogleAnalytics: false,
  maintenanceMode: false,
  allowRegistration: false,
  enableAdminTheme: false,
  adminPrimaryColor: null,
  adminSecondaryColor: null,
  adminBackgroundColor: null,
  adminTextColor: null,
  adminTheme: null,
  fullAddress: "2501 CASE STREET, BATESVILLE 72501, ARKANSAS, USA ",
  navItems: [
    { title: "Courses", href: "/courses" },
    { title: "Lectures", href: "/lectures" },
    { title: "Pricing", href: "/pricing" },
    { title: "Implementation Plan", href: "/implementation-plan" },
  ],
  footerLinks: [
    {
      title: "Product",
      links: [
        { title: "Features", href: "/features" },
        { title: "Pricing", href: "/pricing" },
        { title: "Implementation Plan", href: "/implementation-plan" },
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
};
