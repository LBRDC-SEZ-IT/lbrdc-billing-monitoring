"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container max-w-[64rem] flex flex-col items-center gap-4 text-center">
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
          <Link href="/login">
            <Button size={"lg"}>Get Started</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
