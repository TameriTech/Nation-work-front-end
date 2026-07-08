// app/components/theme-initializer.tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if there's a mismatch between the HTML class and the theme state
    const htmlClass = document.documentElement.classList.contains('dark');
    const shouldBeDark = theme === 'dark';
    
    if (htmlClass !== shouldBeDark) {
      // Force the theme to match the HTML class
      if (htmlClass) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [theme, setTheme]);

  return null;
}
