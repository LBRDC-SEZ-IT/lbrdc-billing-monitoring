"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import ThemeToggleSwitch from "./theme-toggle-switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

interface SideNavProps {
  items?: NavItem[];
  emailAddress: string;
}

export default function SideNav({ items, emailAddress }: SideNavProps) {
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

      <div className="flex flex-col gap-6 p-3 lg:p-6">
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <span className="truncate text-sm font-medium">{emailAddress}</span>
        </div>
        <Separator className="hidden lg:block" />
        <ThemeToggleSwitch />
      </div>
    </aside>
  );
}
