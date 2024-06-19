"use client";

import SideNav from "@/components/side-nav";
import { outboundConfig } from "@/config/outbound";
import React from "react";

interface PayrollLayoutProps {
  children: React.ReactNode;
}

export default function PayrollLayout({ children }: PayrollLayoutProps) {
  return (
    <div className="flex">
      <SideNav items={outboundConfig.sideNav} />
      <main className="flex-1 bg-muted-foreground/5">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </div>
  );
}
