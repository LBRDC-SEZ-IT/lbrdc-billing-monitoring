export type SiteConfig = {
  name: string
  description: string
  url: string
  links: {
    website: string
  }
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type MarketingConfig = {
  mainNav: MainNavItem[]
}