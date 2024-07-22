import { Icons } from "@/components/icons";
import { NavItem } from "@/types";

export type InboundConfig = {
  sideNav: NavItem[]
}

export const inboundConfig: InboundConfig = {
  sideNav: [
    {
      title: "Dashboard",
      visible: true,
      href: "/",
      icon: Icons.sideNavigation.dashboard
    },
    {
      title: "Accounts",
      visible: true,
      icon: Icons.sideNavigation.accounts,
      href: "/inbound",
    },
    {
      title: "Management",
      visible: true,
      icon: Icons.sideNavigation.management,
      hasSubMenu: true,
      subMenuItems: [
        {
          title: "Clients",
          visible: true,
          href: "/clients",
        },
        {
          title: "Groups",
          visible: true,
          href: "/groups",
        },
      ]
    }
  ]
}