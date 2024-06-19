"use client";

import { siteConfig } from "@/config/site";
import { CurrentUserFirstName, CurrentUserLastName, CurrentUserRoleType } from "@/config/user";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

interface SideNavProps {
  items?: NavItem[];
}

export default function SideNav({ items }: SideNavProps) {
  const pathName = usePathname();

  return (
    <aside className="flex flex-col w-14 min-w-14 lg:w-64 lg:min-w-64 bg-background border-r space-y-6 h-screen sticky top-0 left-0 z-50 overflow-hidden">
      <div className="flex gap-2 p-4 lg:p-6">
        <Icons.logo className="size-6 min-h-6 min-w-6" />
        <Link href="/">
          <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
        </Link>
      </div>

      <div className="flex-1">
        {items?.length &&
          items.map(
            (item, index) =>
              item.visible &&
              (item.hasSubMenu && item.subMenuItems ? (
                <Accordion key={index} type="multiple">
                  <AccordionItem value={item.title} className="border-0">
                    <AccordionTrigger
                      className={cn(
                        buttonVariants({ size: "lg", variant: "ghost" }),
                        "hover:no-underline justify-start rounded-none px-[26px]",
                        !item.visible && "hidden"
                      )}>
                      {item.icon && <item.icon className="min-w-5 min-h-5 size-5 mr-2.5" />}
                      <span className="mr-auto">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col">
                      {item.subMenuItems.map(
                        (subItem, index) =>
                          subItem.visible && (
                            <Link
                              href={subItem.href ?? "#"}
                              key={index}
                              className={cn(
                                buttonVariants({ size: "lg", variant: "ghost" }),
                                "justify-start pl-14 rounded-none",
                                pathName == subItem.href! && "font-bold"
                              )}>
                              {subItem.title}
                            </Link>
                          )
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  key={index}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "ghost" }),
                    "justify-start w-full rounded-none px-[26px]",
                    pathName == item.href! && "font-bold"
                  )}>
                  {item.icon && <item.icon className="min-w-5 min-h-5 size-5 mr-2.5" />}
                  {item.title}
                </Link>
              ))
          )}
      </div>

      <div className="flex flex-col items-center gap-6 p-3 lg:p-6">
        <div className="flex items-center gap-2 w-full lg:px-2">
          <Avatar className="size-8 lg:size-10">
            <AvatarFallback>{CurrentUserFirstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm">
              {CurrentUserFirstName} {CurrentUserLastName}
            </span>
            <span className="text-xs text-muted-foreground">{CurrentUserRoleType}</span>
          </div>
        </div>
        <Separator className="hidden lg:block" />
        {/* <ThemeToggleSwitch /> */}
      </div>
    </aside>
  );
}
