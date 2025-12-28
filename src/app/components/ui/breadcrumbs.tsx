import { Fragment, use, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { BreadcrumbsProps, BreadcrumbItem } from "@/app/types/admin";
import Link from "next/link";

export function Breadcrumbs({ config = {}, className }: BreadcrumbsProps) {
  const location = usePathname();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const pathSegments = location.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return [{ label: "Home", href: "/" }];
    }

    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Use config label if available, otherwise format the segment
      const label =
        config[currentPath] || config[segment] || formatSegment(segment);

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [location, config]);

  function formatSegment(segment: string): string {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={index}>
              {!isFirst && (
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-slate-400/50" />
                </li>
              )}
              <li className="flex items-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 text-slate-400 transition-colors hover:text-foreground",
                      isFirst && "text-slate-400"
                    )}
                  >
                    {isFirst && <Home className="h-4 w-4" />}
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-medium",
                      isLast ? "text-foreground" : "text-slate-400"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
