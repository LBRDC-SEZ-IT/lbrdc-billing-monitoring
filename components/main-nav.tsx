import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { Icons } from "./icons";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-10">
      <Link href="/" className="flex space-x-2">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="hidden sm:flex gap-6 items-end">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "text-sm font-medium hover:text-foreground/80 transition-colors",
                item.disabled && "cursor-not-allowed opacity-80"
              )}>
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
