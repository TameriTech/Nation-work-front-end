// app/components/theme-debugger.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebugger() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Theme Debug</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">Theme: {theme}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">Resolved: {resolvedTheme}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        HTML class: {document.documentElement.className}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Has dark class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
