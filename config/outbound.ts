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
      title: "Outbound Accounts",
      visible: true,
      icon: Icons.navPayables,
      href: "/outbound",
    },
  ]
}