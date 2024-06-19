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
      href: "/inbound",
      icon: Icons.navDashboard
    },
    {
      title: "Accounts",
      visible: true,
      icon: Icons.navPayables,
      hasSubMenu: true,
      subMenuItems: [
        {
          title: "All",
          visible: true,
          href: "/inbound/accounts",
          icon: Icons.navPayables
        },
      ]
    },
  ]
}