"use client";

import SideNav from "@/components/side-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { inboundConfig } from "@/config/inbound";
import { outboundConfig } from "@/config/outbound";
import { siteConfig } from "@/config/site";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Link from "next/link";
import React, { useEffect } from "react";

interface PayrollLayoutProps {
  children: React.ReactNode;
}

export default function PayrollLayout({ children }: PayrollLayoutProps) {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    storeUser({});
  });

  if (!user) {
    return (
      <div className="flex flex-col h-screen">
        <div className="container max-w-[64rem] flex-1 flex flex-col items-center justify-center gap-4 text-center h-full">
          <Link
            href={siteConfig.links.website}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank">
            Check our main website
          </Link>
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            Welcome to BillingSync!
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Your Trusted Companion for Simplified Billing Monitoring. Keep Your Billing Process in
            Perfect Sync, Anytime, Anywhere.
          </p>
          <Link href="/sign-in">
            <Button size={"lg"} className="font-bold">
              Login Now
            </Button>
          </Link>
        </div>
        <footer className="bg-primary/5 h-20 border-t">
          <div className="container flex h-full items-center justify-between">
            <p>LBP Resources and Development Corporation</p>
            <ThemeToggle />
          </div>
        </footer>
      </div>
    );
  }

  const userRole = user.organizationMemberships?.[0]?.role || "";
  const userEmail = user.emailAddresses[0].emailAddress || "No email address";

  const navigations =
    userRole === "org:manager_outbound"
      ? outboundConfig.sideNav
      : userRole === "org:manager_inbound"
        ? inboundConfig.sideNav
        : undefined;

  return (
    <div className="flex">
      <SideNav items={navigations} emailAddress={userEmail} />
      <main className="flex-1 bg-muted-foreground/5">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </div>
  );
}
