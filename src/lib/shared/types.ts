export interface SiteSettings {
  siteName: string
  description: string
  siteUrl: string
  ogImage?: string | null
  primaryColor?: string | null
  maintenanceMode: boolean
  enableGoogleAnalytics: boolean
  googleAnalyticsId?: string | null
  navItems: NavItem[]
  footerLinks: FooterSection[]
}

export interface NavItem {
  title: string
  href: string
}

export interface FooterSection {
  title: string
  links: NavItem[]
}

export interface SEOMetadata {
  title: string
  description: string
  url: string
  ogImage: string | null
}
