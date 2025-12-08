"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

export function NavLink({
  href,
  children,
  className,
  activeClassName,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // **Call the function inside the component**
  const computedClassName = cn(className, isActive && activeClassName);

  return (
    <Link href={href} className={computedClassName}>
      {children}
    </Link>
  );
}
