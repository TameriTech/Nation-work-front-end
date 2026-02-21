import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import type { SidebarProps, NavItem } from "@/app/types/admin";
import Link from "next/link";

export function Sidebar({
  isOpen,
  onToggle,
  navItems,
  logo,
  collapsed = false,
  onCollapse,
}: SidebarProps) {
  const location = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  const isActive = (href: string) => {
    return (
      location === href ||
      (location.startsWith(href + "/") && href !== "/dashboard/admin")
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const Icon = item.icon;

    const content = (
      <div className="flex items-center justify-start w-full h-full gap-2">
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            active
              ? "text-white dark:text-white"
              : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300",
          )}
        />
        {!collapsed && (
          <>
            <span
              className={cn(
                "flex-1 text-left truncate",
                active
                  ? "text-white dark:text-white"
                  : "text-gray-700 dark:text-gray-300",
              )}
            >
              {item.title}
            </span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            )}
          </>
        )}
      </div>
    );

    const linkClasses = cn(
      "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
      depth > 0 && "ml-4 w-[calc(100%-1rem)]",
      active
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      collapsed && "justify-center px-2",
    );

    const navElement = hasChildren ? (
      <button
        onClick={() => toggleExpanded(item.href)}
        className={linkClasses}
        aria-expanded={isExpanded}
      >
        {content}
      </button>
    ) : (
      <Link href={item.href} className={linkClasses} onClick={() => onToggle()}>
        {content}
      </Link>
    );

    if (collapsed && !hasChildren) {
      return (
        <TooltipProvider key={item.href}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{navElement}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div key={item.href}>
        {navElement}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Largeurs fixes
  const sidebarWidth = collapsed ? "w-[72px]" : "w-[256px]";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 dark:bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl",
          "lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarWidth,
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-800",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link
              href={"/dashboard/admin"}
              className="flex items-center gap-2 overflow-hidden"
            >
              {logo || (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0">
                  <img src="/icons/logo.png" alt="Logo" />
                </div>
              )}
              <span className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                Nation Work
              </span>
            </Link>
          )}
          {collapsed && (
            <Link
              href={"/dashboard/admin"}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0"
            >
              <img src="/icons/logo.png" alt="Logo" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden flex-shrink-0"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1.5" aria-label="Main navigation">
            {navItems.map((item) => renderNavItem(item))}
          </nav>
        </ScrollArea>

        {/* Collapse toggle (desktop only) */}
        {onCollapse && (
          <div className="hidden border-t border-gray-200 p-3 dark:border-gray-800 lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className={cn(
                "w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                collapsed && "justify-center",
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  collapsed && "rotate-180",
                )}
              />
              {!collapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
