import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { marketingConfig } from "@/config/marketing";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between">
          <MainNav items={marketingConfig.mainNav} />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {/* Add Footer */}
    </div>
  );
}
