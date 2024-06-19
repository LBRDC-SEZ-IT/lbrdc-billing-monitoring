"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === "dark");

  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  function handleSwitch() {
    if (darkMode) {
      setTheme("light");
    } else {
      setTheme("dark");
    }

    setDarkMode(!darkMode);
  }

  return (
    <div className="w-full hidden lg:flex items-center justify-between px-2">
      <Label htmlFor="dark-mode" className="text-muted-foreground">
        Dark Mode
      </Label>
      <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleSwitch} />
    </div>
  );
}
