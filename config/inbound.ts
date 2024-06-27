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
      icon: Icons.navDashboard
    },
    {
      title: "Inbound Accounts",
      visible: true,
      icon: Icons.navPayables,
      href: "/inbound",
    },
  ]
}