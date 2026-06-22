export interface SiteSettings {
  id: string;
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  primaryColor?: string | null;
  ogImage?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  googleAnalyticsId?: string | null;
  fullAddress?: string | null;
  maintenanceMode: boolean;
  enableGoogleAnalytics: boolean;
  allowRegistration: boolean;
  
  // Layout & UI Structure
  navItems: NavItem[];
  footerLinks: FooterSection[];
}

export interface NavItem {
  title: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  url: string;
  ogImage: string | null;
}
