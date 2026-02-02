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
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return (
      location === href ||
      (location.startsWith(href + "/") && href !== "/admin")
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const Icon = item.icon;

    const content = (
      <>
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            active ? "text-gray-50" : "text-gray-400 group-hover:text-gray-300"
          )}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-sidebar-muted transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </>
    );

    const linkClasses = cn(
      "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
      depth > 0 && "ml-4 w-auto",
      active
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-400/80 hover:bg-gray-300/20 hover:text-white",
      collapsed && "justify-center px-2"
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
        <TooltipProvider>
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>{navElement}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col  bg-[#0d1526] shadow-sidebar transition-all duration-300 ease-in-out",
          "lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-sidebar-collapsed " : "lg:w-sidebar w-[256px]",
          ""
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-gray-300/10 px-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              {logo || (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
              )}
              <span className="text-lg font-semibold text-sidebar-foreground">
                Admin
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <span className="text-sm font-bold text-white">A</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
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
          <div className="hidden border-t border-gray-300/10 p-3 lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapse}
              className={cn(
                "w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center"
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  collapsed && "rotate-180"
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
