import { Icons } from "@/components/icons";
import { NavItem } from "@/types";

type OutboundConfig = {
  sideNav: NavItem[]
}

export const outboundConfig: OutboundConfig = {
  sideNav: [
    {
      title: "Dashboard",
      visible: true,
      icon: Icons.navDashboard,
      href: "/",
    },
    {
      title: "Accounts",
      visible: true,
      icon: Icons.navPayables,
      href: "/outbound",
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