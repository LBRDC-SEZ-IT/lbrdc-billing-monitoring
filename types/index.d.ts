import { LucideIcon } from "lucide-react";

export type SortType = "Text" | "Number" | "Date" | "Default";
export type AlignType = "start" | "end";

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
  visible: boolean
  icon?: LucideIcon
  href?: string
  disabled?: boolean
  hasSubMenu?: boolean
  subMenuItems?: NavItem[]
}

export type MarketingConfig = {
  mainNav: NavItem[]
}

export type PayableConfig = {
  sideNav: NavItem[]
}

export type InboundConfig = {
  sideNav: NavItem[]
}