import { Icons } from "@/components/icons";
import { NavItem } from "@/types";
import { CurrentUserRoleType } from "./user";

type OutboundConfig = {
  sideNav: NavItem[]
}

export const outboundConfig: OutboundConfig = {
  sideNav: [
    {
      title: "Dashboard",
      visible: true,
      href: "/outbound",
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
          href: "/outbound/accounts",
          icon: Icons.navPayables
        },
        {
          title: "Approvals",
          visible: CurrentUserRoleType === "Manager",
          href: "/outbound/approvals",
          icon: Icons.navPayables
        },
        {
          title: "My Entries",
          visible: true,
          href: "/outbound/user-entries",
          icon: Icons.navPayables
        },
      ]
    },
  ]
}